var trackedElements = "";

function countElement(tagName) {
    var count = $(tagName).length;
    chrome.runtime.sendMessage({"type": "tagCount", "tagName": tagName, "count":count});
}

$(document).ready(function() {
    chrome.runtime.sendMessage({"type": "requestTrackedElements"}, function(response ){
        trackedElements = response.trackedElements;
        for (var i = 0; i < trackedElements.length; i++) {
            countElement(trackedElements[i]);
        }
    });
});
