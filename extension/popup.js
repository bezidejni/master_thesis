var cpu = 0;
var statusEl = document.getElementById('status');
var page = chrome.extension.getBackgroundPage();

function initExt() {
    if (page.running === "false") {
        statusEl.innerHTML = 'inactive';
        statusEl.className += ' inactive';
    }
    else {
        statusEl.innerHTML = 'active';
        statusEl.className += ' active';
    }
    updateCpuInfo();
    setInterval(updateCpuInfo, 1000);

}

function updateCpuInfo() {
  var el = document.getElementById('load');
  cpu = page.cpuUsage;
  el.innerHTML = cpu;
}



document.addEventListener('DOMContentLoaded', initExt);