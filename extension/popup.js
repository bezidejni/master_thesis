var cpu = 0;

function initExt() {
    updateCpuInfo();
    setInterval(updateCpuInfo, 1000);

}

function updateCpuInfo() {
  var el = document.getElementById('load');
  var el = document.getElementById('load');
  var page = chrome.extension.getBackgroundPage();
  cpu = page.cpuUsage;
  el.innerHTML = cpu;
}



document.addEventListener('DOMContentLoaded', initExt);