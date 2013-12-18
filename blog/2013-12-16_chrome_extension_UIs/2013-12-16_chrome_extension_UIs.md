# Chrome extension UI options

## Intro
For a lot, if not most, of browser extensions, just running hidden in the background is not enough to be useful. They often need a way of presenting useful information to the user and give them a way of controlling the extension behaviour, enabling and disabling the extension, accessing the options and many other things that are possible. In this blog post, I'll try to describe common ways the extension UI is done in Chrome, describe strenghts and weaknesses of every approach and try to decide which approach would be good for our extension.

## Browser action
Browser action type of UI is used when the extension is relevant to most web pages the user visits. If the extension's purpose is, for example, to block ads on all pages - then the browser action is a good choice. The extension icon is located to the right of the URL bar (Omnibox) and usually presents the user with a small popup when the icon is clicked. Useful info or extension controls can be displayed on the popup.

SLIKA 1

As you can see in the screenshot, [AdBlock](https://chrome.google.com/webstore/detail/adblock/gighmmpiobklfepjocnamgkkbiglidom?hl=en) is an example of the extension that utilizes the browser action approach. Popup look is defined in a separate HTML page in an extension. Of course, the extension can also use a background page and content scripts (as described in [my previous post](http://sgros-students.blogspot.com/2013/06/tracking-of-potentially-interesting.html)) if needed, to interact with the Chrome extensions API and the page currently displayed in the browser.

As you can see, this approach is relatively simple and is enough for most extensions out there, but if extension UI needs to be shown only on some pages (in some cases) or more advanced features are needed to interact with the page, one of the next two options might be more suitable. 

## Page action
If the extension needs to be running only on some (not most) pages the user visits, the page action might be a good choice. The extension icon is shown inside the URL bar (Omnibox) near the right edge and behaves similar to the browser action. One example of this type of UI is the extension HTTPS Everywhere which forces HTTPS connections on sites where that option is available. Its icon is only shown in the URL bar when it detects it's on a compatible web page, or that web page has HTTP calls to other compatible web pages:

SLIKA 2

In the screenshot, the page action is shown because it detected compatible web pages. By default, the page action is hidden but the extension author can specify the conditions that need to be satisfied before the `show()` method is called. That can happen if the user visits some URL (for example, it can be shown only on google.com domain), the page he visits contains some HTML element or text or anything else that can be detected using javascript.

This type of browser UI is obviously a bit more complicated than the browser action because it is not shown on every page, but other than that, behaves relatively similar to it.

## DevTools extension
Some extensions are meant to be used by advanced users and require more interactivity with the page HTML or Javascript code, in that case extending the [Chrome DevTools](https://developers.google.com/chrome-developer-tools/) is a good approach.

An extension of that type is structured similar to ones described above, they can also contain a background page and content scripts, but also have access to several DevTools-specific extension APIs. Those APIs allow it to get information about network requests or get information about the inpected window and potentially run JS code in it. The difference when running the JS code this way when compared with content scripts is that the code is run in the of the inspected page, meaning that it has access to all the defined JS variables and functions in the page. Obviously, this is potentially very dangerous so the developer must take extra care not to introduce any security vulnerabilities.

Instead of being displayed near the URL bar, this type of UI is displayed each time the DevTools window opens. There are two places in the DevTools where the UI can be placed:

1. panels
2. sidebar pane (only in Elements panel)

SLIKA 3

Adding the UI in the form of a panel is similar to a browser/page action popup, except we can add multiple panels for different actions. A sidebar pane differs from that because it's (at the moment) only available in the elements panel and can add different actions depending on what HTML element is currently selected in the elements panel. The example of that is the "Styles" sidebar pane which shows the CSS applied to the currently selected element. This is probably the most interactive and advanced type of extension UI as it allows the user to select any HTML element and perform the actions that are offered by the extension

## Our needs and conclusion
A good thing is that some of the approaches above can be combined. While our needs and plans aren't defined yet, a possible way to go would be combining the browser action and the DevTools part.

Browser action would contain basic functionality, most important info for the user and the option to start/stop the extension and access the configuration options. More advanced and interactive functionality would be accessible only through the DevTools window which allows a nice separation between "regular" and more advanced users.