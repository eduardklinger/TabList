// Service worker for Manifest V3
// Import utility functions
importScripts('openlist-lib.js');

chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create({
        "title": "OpenList", 
        "id": "OpenList-ContextMenuOpen", 
        "contexts": ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "OpenList-ContextMenuOpen") {
        openList(info.selectionText, tab);
    }
});