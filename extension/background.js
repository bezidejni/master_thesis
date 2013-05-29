cpuUsage = 0;
var running = localStorage["running"] || false;

function init() {
    chrome.experimental.processes.onUpdated.addListener(function(processes) {
        var total = 0;
        for(var pid in processes) {
            total += processes[pid].cpu;
        }
        cpuUsage = total;
    });
    var pollingFrequency = localStorage["pollingFrequency"] * 1000;
    if (running == "true") {
        setInterval(saveCpuInfo, pollingFrequency || 10000);
    }
}

function saveCpuInfo() {
    var time = new Date().getTime();
    var key = "cpu_" + time;
    localStorage.setItem(key, cpuUsage);
}

document.addEventListener('DOMContentLoaded', init);