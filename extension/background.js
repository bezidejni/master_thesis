cpuUsage = 0;
var running = localStorage["running"] || false;
var trackedSites = localStorage['trackedSites'] || "";
var pollingFrequency = localStorage["pollingFrequency"] * 1000;
var logProcess = false;

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
