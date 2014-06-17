this.manifest = {
    "name": "Intrusion Prevention System",
    "icon": "../../icons/icon48.png",
    "settings": [
        {

            "tab": "General options",
            "group": "Basic settings",
            "name": "trackingEnabled",
            "type": "checkbox",
            "label": "Tracking enabled",
        },
        {

            "tab": "General options",
            "group": "Basic settings",
            "name": "serverURL",
            "type": "text",
            "label": "Server URL (including http://)",
            "text": "http://ips.jukic.me",
        },
        {
            "tab": "General options",
            "group": "Basic settings",
            "name": "saveData",
            "type": "checkbox",
            "label": "Save tracked data",
            "value": true,
            "checked": true
        },
        {
            "tab": "General options",
            "group": "Basic settings",
            "name": "trackAllSites",
            "type": "checkbox",
            "label": "Track all sites",
        },
        {
            "tab": "General options",
            "group": "Basic settings",
            "name": "trackedSites",
            "type": "textarea",
            "label": "Tracked sites:",
            "text": "Example: http://www.google.com"
        },
        {
            "tab": "CPU Usage",
            "group": "Settings",
            "name": "pollingFrequency",
            "type": "slider",
            "label": "Polling frequency:",
            "max": 60,
            "min": 2,
            "step": 0.5,
            "display": true,
            "value": 5,
            "displayModifier": function (value) {
                return value.floor() + "s";
            }
        },
        {
            "tab": "DOM Elements",
            "group": "Settings",
            "name": "trackedElements",
            "type": "textarea",
            "label": "DOM Elements to track:",
            "text": "For example: div"
        }
    ]
};
