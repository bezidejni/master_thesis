cpuUsage = 0;
var trackingEnabled = store.get("store.settings.trackingEnabled") || "false";
var trackAllSites = store.get("store.settings.trackAllSites");
var trackedSites = localStorage['trackedSites'] || "";
var pollingFrequency = store.get("store.settings.pollingFrequency") * 1000;
var logProcess = false;
var fileWriter;
var filer = new Filer();

function onError(e) {
  console.log('Error' + e.name);
}

filer.init({persistent: true, size: 1024 * 1024}, function(fs) {
}, onError);

function init() {
    chrome.processes.onUpdated.addListener(function(processes) {
        var total = 0;
        for(var pid in processes) {
            total += processes[pid].cpu;
        }
        cpuUsage = total;
    });
    chrome.tabs.onUpdated.addListener(logOrNot);
    countDOMElements();
}

function saveCpuInfo() {
    var time = new Date().getTime();
    var key = "cpu_" + time;
    store.set(key, cpuUsage);
    filer.write("cpu_log.txt", {data: time + ": " + cpuUsage + "\n", type: 'text/plain', append:true});
}

function countDOMElements() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.type == "tagCount") {
                console.log("Broj elemenata " + request.tagName + " je " + request.count);
                sendResponse({answer: "super"});
            }
        });
    var trackedElements = store.get('store.settings.trackedElements') || "";
    console.log(trackedElements);
    trackedElements = trackedElements.split('\n');
    chrome.tabs.query({active: true}, function(tabs) {
        console.log(tabs);
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, {"type": "trackedElements", "trackedElements": trackedElements}, function(response) {
                console.log(response.answer);
            });
        }
    });
}


function logOrNot(tabId, changeInfo, tab) {
    if (trackingEnabled === true) {
        if (trackAllSites || siteTracked(tab.url)) {
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


document.addEventListener('DOMContentLoaded', init);
