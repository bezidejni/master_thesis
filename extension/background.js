cpuUsage = 0;
var running = localStorage["running"] || "false";
var trackedSites = localStorage['trackedSites'] || "";
var pollingFrequency = localStorage["pollingFrequency"] * 1000;
var logProcess = false;
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
var fileWriter = null;

function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  }
  alert('Error: ' + msg);
}

function onInitFs(fs) {
    fs.root.getFile('log.txt', {create: true}, function(file) {
        file.createWriter(function(fw) {
            fileWriter = fw;
        });
    }, errorHandler);
}

function initFS() {
  window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
    window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
  }, function(e) {
  console.log('Error', e);
});
}


if (window.requestFileSystem) {
  initFS();
}

function init() {
    chrome.experimental.processes.onUpdated.addListener(function(processes) {
        var total = 0;
        for(var pid in processes) {
            total += processes[pid].cpu;
        }
        cpuUsage = total;
    });
    chrome.tabs.onUpdated.addListener(logOrNot);
}

function saveCpuInfo() {
    var time = new Date().getTime();
    var key = "cpu_" + time;
    localStorage.setItem(key, cpuUsage);
    fileWriter.write(new Blob([time + ": " + cpuUsage + "\n"], {type: 'text/plain'}));
}

function logOrNot(tabId, changeInfo, tab) {
    if (siteTracked(tab.url)) {
        chrome.pageAction.show(tabId);
        if (running == "true") {
            if (logProcess) {
                clearInterval(logProcess);
            }
            logProcess = setInterval(saveCpuInfo, pollingFrequency || 10000);
        }
    }
}

function siteTracked(url) {
    var domain = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
    if (trackedSites.indexOf(domain) != -1) {
        return true;
    }
    else {
        return false;
    }
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.indexOf('g') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
}

document.addEventListener('DOMContentLoaded', init);
