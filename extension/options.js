var freq_el = document.getElementById("pollingFrequency");
var freq_info = document.getElementById("freq");
var running_el = document.getElementById("running");
var trackedSites_el = document.getElementById("tracked_sites");

// Saves options to localStorage.
function save_options() {
  localStorage["pollingFrequency"] = freq_el.value;
  localStorage["running"] = running_el.checked;
  localStorage["trackedSites"] = trackedSites_el.value;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 1500);
  var bkg = chrome.extension.getBackgroundPage();
  bkg.location.reload();
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var freq = localStorage["pollingFrequency"];
  var running = localStorage["running"];
  var tracked = localStorage["trackedSites"];
  if (!freq) {
    freq_el.value = 10;
    freq_info.value = 10;
    return;
  }
  freq_el.value = freq;
  freq_info.value = freq;
  trackedSites_el.value = tracked || '';

  console.log(running);
  if (running == "true") {
      running_el.checked = true;
  }
}

function updateRange() {
  var freq = document.getElementById("freq");
  freq.value = this.value;
}

freq_el.addEventListener("change", updateRange);
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);


