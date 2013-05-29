# Tracking of potentially interesting data in a browser extension

## Intro
As noted in my last post, the next step is to identify potentially interesting data that the browser extension can track and analyze during a web browsing session. At this point, we're not completely sure which data will be useful to us, so listed below are some of the potentially most interesting and useful things to track. A small Google Chrome extension is created as a proof of concept, which will be described as well as the Chrome extension architecture.


## What to track

### Network traffic
Since our goal is to write a IPS for the browser, tracking network traffic is obviously a requirement. During normal browsing, it's possible to see the network requests in Chrome DevTools:

![Chrome DevTools](file:///Users/bezidejni/Documents/projekti/GitHub/master_thesis/blog/2013-5-14_tracking_of_potentially_interesting_data/1_chrome_devtools_network.png)

Browser extensions can use the [chrome.webRequest](http://developer.chrome.com/dev/extensions/webRequest.html) API to catch network requests. During the life cycle of a web request, several events are fired which we can use to analyze the traffic and decide what to do with the request. The event life cycle is shown in the image below:

![Chrome DevTools](file:///Users/bezidejni/Documents/projekti/GitHub/master_thesis/blog/2013-5-14_tracking_of_potentially_interesting_data/2_webrequestapi.png)

The granularity of those events enable us to, for example, catch and log the request between sending it to the remote server, and then analyze the response when it arrives. Or alternatively, if the requested domain is known to be malicious, the request can be denied completely. Logging every HTTP request made during browsing will be very useful for statistically analyzing the data later.

### CPU and memory usage
Using [experimental.systemInfo.cpu](https://developer.chrome.com/dev/extensions/experimental.systemInfo.cpu.html) and [chrome.experimental.processes](https://developer.chrome.com/dev/extensions/experimental.processes.html) it's possible to track CPU and memory usage per process/tab. In the learning process, during normal browsing, extension will track the usage and try to establish the average CPU/memory usage as a baseline and will later compare the usage during browsing to that baseline.

The idea is that some malicious sites will try to max out the CPU and memory usage and cause the browser and/or system to be unresponsive, which the extension will detect as it would differ significantly compared to the baseline values. Special attention is needed to avoid identifyng CPU and memory usage spikes on regular websites as a  potential malicious activity.

### DOM (Document Object Model)
Tracking objects in the DOM is a tricky subject as the pages on the web differ significantly and there are many ways to attack the user.

Defending against clickjacking attacks is described in the article [A Solution for the Automated Detection of Clickjacking Attacks](http://www.iseclab.org/papers/asiaccs122-balduzzi.pdf). The idea is to track iframes on the page and when the user clicks on something, detect if there are overlapping clickable elements in the location of the click, suggesting potentially malicious transparent element in the iframe, as shown on the image below:

![Twitter Clickjacking](file:///Users/bezidejni/Documents/projekti/GitHub/master_thesis/blog/2013-5-14_tracking_of_potentially_interesting_data/3_twitter_clickjacking.png)

## Chrome extensions architecture
### Extensions overview
A Chrome extension is a zipped bundle of HTML, CSS and Javascript files that add functionality to the browser. Extensions are basically web pages and as such, they can use the APIs that browsers provide to web pages, in addition to Chrome APIs made for use in extensions.

Many extensions have a background page, an invisible page that holds the main logic of the extension. An extension can also contain other pages that present the extension's UI. If the UI is needed, it can be presented as a browser action (shown on all pages) or page action (shown only on some pages, depending on a page). The following image shows the architecture of an extension with a browser action:

![Browser action architecture](file:///Users/bezidejni/Documents/projekti/GitHub/master_thesis/blog/2013-5-14_tracking_of_potentially_interesting_data/4_browser_action_architecture.gif)

The HTML pages inside an extension have complete access to each other's DOMs, and they can invoke functions on each other. In the background page, we can use any of the chome.* APIs, but if we need to interact with the page currently loaded in the browser, to read and change the DOM, we need to use [content scripts](http://developer.chrome.com/extensions/content_scripts.html).

### Content scripts
A content script is some JavaScript that executes in the context of a page that's been loaded into the browser. It behaves more like a part of the loaded page than a part of the extension. They can access and change the web pages the user visits, but cannot modify the DOM of its  parent extension background page. This increases security as the malicious web page cannot use the extensions content script to attack the extension.

But the content scripts aren't completely cut off from the extension. They can communicate with the extension by sending messages using the [chrome.runtime.sendMessage](http://developer.chrome.com/extensions/runtime.html#method-sendMessage) API call. The architecture is shown here:

![Content script architecture](file:///Users/bezidejni/Documents/projekti/GitHub/master_thesis/blog/2013-5-14_tracking_of_potentially_interesting_data/5_chrome_extension_architecture.png)

It's also important to note that content scripts are run in a special environment called an isolated world. They have access to the DOM of the page they are injected into, but not to any JavaScript variables or functions created by the page. Basically, the content script can't access the javascript code running on the page, and the same is in reverse - javascript code on the page cannot interfere with the content script. This is shown here:

![Content script isolation](file:///Users/bezidejni/Documents/projekti/GitHub/master_thesis/blog/2013-5-14_tracking_of_potentially_interesting_data/6_content_scripts_isolated.png)

While this protects our extension against malicious web pages, it also limits what we can do. To get around that, we can either set up event listeners which will intercept events on the loaded page, or inject a javascript script directly to the page. The latter method is insecure and shouldn't be used for communicating with the extension.

## Extension proof of concept
This simple extension tracks the CPU usage of the browser and shows it to the user when the browser action button is clicked. Also, it has a configuration page where the user can configure how often will the data be saved and whether or not the saving is enabled.

The extension consists of:

1. browser action - popup page that is shown the the extension button is clicked and dsplays the cpu usage to the user
2. background page - it handles getting the CPU data from the chrome API and saves the data to localStorage
3. options page - shows the configuration options to the user

On the next image, the popup and options page are shown:
![Extension  POC](file:///Users/bezidejni/Documents/projekti/GitHub/master_thesis/blog/2013-5-14_tracking_of_potentially_interesting_data/7_extension_poc.png)

The next step is adding new functionality to the extension such as adding a content script to track DOM data and adding more configuration parameters to the options page.
