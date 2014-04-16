cpuUsage = 0;
var trackingEnabled = store.get("store.settings.trackingEnabled") || "false";
var trackAllSites = store.get("store.settings.trackAllSites");
var trackedSites = localStorage['trackedSites'] || "";
var pollingFrequency = store.get("store.settings.pollingFrequency") * 1000;
var logProcess = false;
var fileWriter;
var filer = new Filer();

var networkEventsWaiting = {};
var networkEventsComplete = [];

var domElementCount = [];

var cpuUsageList = [];

function onError(e) {
  console.log('Error' + e.name);
}

filer.init({persistent: true, size: 1024 * 1024}, function(fs) {
}, onError);

function init() {

    chrome.tabs.onUpdated.addListener(logOrNot);
}

function saveCpuInfo() {
    var time = new Date().getTime();
    var key = "cpu_" + time;
    store.set(key, cpuUsage);
    filer.write("cpu_log.txt", {data: time + ": " + cpuUsage + "\n", type: 'text/plain', append:true});
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
    return trackedSites.indexOf(domain) !== -1;
}


document.addEventListener('DOMContentLoaded', init);

function handleNetworkResponse(details) {
    chrome.tabs.get(details.tabId, function(tab) {
        networkEventsWaiting[details.requestId].source_url = tab.url;
        networkEventsComplete.push(networkEventsWaiting[details.requestId]);
        delete networkEventsWaiting[details.requestId];

    });
    networkEventsWaiting[details.requestId] = {
        destination_url: details.url,
        method: details.method,
        http_status: details.statusCode,
        type: details.type,
        timestamp: details.timeStamp
    };
};

function handleDOMElementCount(request, sender, sendResponse) {
    if (request.type === "tagCount") {
        console.log("Broj elemenata " + request.tagName + " je " + request.count);
        domElementCount.push({
            url: sender.tab.url,
            element_name: request.tagName,
            count: request.count
        });
        console.log(domElementCount);
        sendResponse({answer: "super"});
    } else if (request.type === "requestTrackedElements") {
        var trackedElements = store.get('store.settings.trackedElements') || "";
        trackedElements = trackedElements.split('\n');
        sendResponse({trackedElements: trackedElements});
    }
};

chrome.webRequest.onResponseStarted.addListener(
        handleNetworkResponse,
        {urls: ["*://*.com/*"], types: ['main_frame', 'sub_frame', 'script']}
);

chrome.runtime.onMessage.addListener(handleDOMElementCount);

chrome.processes.onUpdated.addListener(function(processes) {
    var total = 0;
    var timestamp = new Date().getTime();
    for(var pid in processes) {
        total += processes[pid].cpu;
    }
    cpuUsageList.push({'timestamp': timestamp, value:total.toFixed(3)});
});

(function sendNetworkDataHome() {
    $.ajax({
        url: 'http://127.0.0.1:8000/network-info/',
        data: JSON.stringify(networkEventsComplete),
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        complete: function() {
            // Schedule the next request when the current one's complete
            setTimeout(sendNetworkDataHome, 10000);
            networkEventsComplete = [];

        }
    });
})();

(function sendDOMElementDataHome() {
    $.ajax({
        url: 'http://127.0.0.1:8000/dom-element-count/',
        data: JSON.stringify(domElementCount),
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        complete: function() {
            // Schedule the next request when the current one's complete
            setTimeout(sendDOMElementDataHome, 10000);
            domElementCount = [];

        }
    });
})();

(function sendCPUInfoDataHome() {
    $.ajax({
        url: 'http://127.0.0.1:8000/cpu-info/',
        data: JSON.stringify(cpuUsageList),
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        complete: function() {
            // Schedule the next request when the current one's complete
            setTimeout(sendCPUInfoDataHome, 10000);
            cpuUsageList = [];

        }
    });
})();