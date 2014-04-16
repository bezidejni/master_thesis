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

chrome.webRequest.onResponseStarted.addListener(
        function(details) {
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

        },
        {urls: ["*://*.index.hr/*"], types: ['main_frame', 'sub_frame', 'script']}
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "tagCount") {
            console.log("Broj elemenata " + request.tagName + " je " + request.count);
            sendResponse({answer: "super"});
        } else if (request.type === "requestTrackedElements") {
            var trackedElements = store.get('store.settings.trackedElements') || "";
            trackedElements = trackedElements.split('\n');
            sendResponse({trackedElements: trackedElements});
        }
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
            //setTimeout(sendDataHome, 10000);
            networkEventsComplete = [];

        }
    });
})();

