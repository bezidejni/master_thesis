# Extension plugin architecture

## Intro
In my previous post, I've described different types of data that can be collected and that could potentially be useful for later analysis. Collecting different types of data may require using different [APIs](http://developer.chrome.com/extensions/api_index.html) inside Chrome and the DOM, so throwing all that code inside one Javascript file would be potentially messy and hard to extend and change later on. This post will describe the ideas and potential solutions to this problem, along with some limitations imposed by Chrome.

## Initial idea
Since Javascript code relies on a lot of callbacks and events, writing the code for collecting the data all in one file would result in code hard to understand, and even harder to extend  later on. The idea is to create a system which would reduce code complexity and make it easier to write and add new segments of tracking code to the extension. By extracting individual parts of tracking code (for CPU, memory, DOM events) into separate files as plugins that can be switched on or off at any time, a common interface for developing those plugins is presented to the developer.

On a technical side, a plugin is a Javascript file, containing the object with all the desired functionality. In the minimal case, the object would have a `start()` and a `stop()` method for controlling the plugin and some sort of data structure describing the settings tab/page for the plugin where the user can configure the plugin if the plugin allows that. Of course, apart from that, the object would contain a set of internal methods that actually do all the work by communicating with the Chrome API or by querying the DOM.

If a developer wants to write a new plugin, he would code based on the above described interface, drop in the .js file into a folder containing the plugins and it would be automatically recognized by the Chrome extension and shown in the extension settings. From there, the user could select all the plugins that he wants to use, and they would be started automatically.

## Problems and limitations
The main problem encountered was that the Chrome extension, or better to say, Chrome itself can't arbitrarily read and write from/to the filesystem. There is a limited functionality available through the [HTML5 File System API](https://developer.mozilla.org/en-US/docs/WebGuide/API/File_System), but it can write and read only from one folder containing the Chrome data. And even then, the files saved there have randomly generated names (e.g. it's not possible to save a file named test.js) which obviously makes it impossible for the user to put his plugins in a folder that the extension would scan and load the plugins.


## Potential solution
One potential solution would be to load the Javascript files off a remote server specified in the core extension settings, but that significantly decreases the ease of use and opens up the extension to potential security problems.

Right now, it seems that the only solution that's simple and safe enough for use is to bundle the plugins along with the extension. Javascript files bundled with the extension can be read normally since we don't have to manually access the filesystem. That way, we still benefit from the plugin-based arhitecture and reduce code complexity, but the drawback is that a regular user can't just place the plugin files in a folder and have them loaded automatically. 