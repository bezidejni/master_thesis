var trackedElements = "";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "trackedElements") {
        console.log("tracked");
        trackedElements = request.trackedElements;
        sendResponse({answer: "ok"});
        for (var i = 0; i < trackedElements.length; i++) {
            countElement(trackedElements[i]);
        }
    }
});

function countElement(tagName) {
    var count = $(tagName).length;
    console.log(count);
    chrome.runtime.sendMessage({"type": "tagCount", "tagName": tagName, "count":count}, function(response ){
        console.log("Response received");
    });
}

$(document).ready(function() {

});
