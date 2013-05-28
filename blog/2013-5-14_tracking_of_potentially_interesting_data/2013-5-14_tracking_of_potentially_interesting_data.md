# Tracking of potentially interesting data in a browser extension

## Intro
As noted in my last post, the next step is to identify potentially interesting data that the browser extension can track and analyze during a web browsing session. At this point, we're not completely sure which data will be useful to us, so listed below are some of the potentially most interesting and useful things to track.

## Network traffic
Since our goal is to write a IPS for the browser, tracking network traffic is obviously a requirement. During normal browsing, it's possible to see the network requests in Chrome DevTools:

![Chrome DevTools](file:///Users/bezidejni/Dropbox/faks/diplomski_rad/2013-5-14_tracking_of_potentially_interesting_data/1_chrome_devtools_network.png)

Browser extensions can use the [chrome.webRequest](http://developer.chrome.com/dev/extensions/webRequest.html) API to catch network requests. During the life cycle of a web request, several events are fired which we can use to analyze the traffic and decide what to do with the request. The event life cycle is shown in the image below:

![Chrome DevTools](file:///Users/bezidejni/Dropbox/faks/diplomski_rad/2013-5-14_tracking_of_potentially_interesting_data/2_webrequestapi.png)

The granularity of those events enable us to, for example, catch and log the request between sending it to the remote server, and then analyze the response when it arrives. Or alternatively, if the requested domain is known to be malicious, the request can be denied completely. Logging every HTTP request made during browsing will be very useful for statistically analyzing the data later.

## CPU and memory usage
Using [experimental.systemInfo.cpu](https://developer.chrome.com/dev/extensions/experimental.systemInfo.cpu.html) and [chrome.experimental.processes](https://developer.chrome.com/dev/extensions/experimental.processes.html) it's possible to track CPU and memory usage per process/tab. In the learning process, during normal browsing, extension will track the usage and try to establish the average CPU/memory usage as a baseline and will later compare the usage during browsing to that baseline.

The idea is that some malicious sites will try to max out the CPU and memory usage and cause the browser and/or system to be unresponsive, which the extension will detect as it would differ significantly compared to the baseline values. Special attention is needed to avoid identifyng CPU and memory usage spikes on regular websites as a  potential malicious activity.

## DOM (Document Object Model)
Tracking objects in the DOM is a tricky subject as the pages on the web differ significantly and there are many ways to attack the user.

Defending against clickjacking attacks is described in the article [A Solution for the Automated Detection of Clickjacking Attacks](http://www.iseclab.org/papers/asiaccs122-balduzzi.pdf). The idea is to track iframes on the page and when the user clicks on something, detect if there are overlapping clickable elements in the location of the click, suggesting potentially malicious transparent element in the iframe, as shown on the image below:

![Twitter Clickjacking](file:///Users/bezidejni/Dropbox/faks/diplomski_rad/2013-5-14_tracking_of_potentially_interesting_data/3_twitter_clickjacking.png)

http://www.cs.ucsb.edu/~vigna/publications/2005_hallaraker_vigna_ICECCS05.pdf
http://www.site.uottawa.ca/~nelkadri/CSI5389/Papers/40-Cova_et_al_WWW2010.pdf
http://www.nds.rub.de/media/emma/veroeffentlichungen/2011/06/21/iceshield-raid11.pdf
