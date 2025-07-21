async function initPopup() {
    try {
        // Get current window and all tabs in it
        const currentWindow = await chrome.windows.getCurrent();
        const tabs = await chrome.tabs.query({windowId: currentWindow.id});
        
        if (!tabs.length) return;
        
        const listTextArea = document.getElementById("list");
        
        // Populate with URLs from all tabs
        for (let i = 0; i < tabs.length; i++) {
            listTextArea.value += tabs[i].url + "\n";
        }
        
        // Focus and select all text
        if (location.search !== "?focusHack") {
            location.search = "?focusHack";
        }
        listTextArea.select();
        
    } catch (error) {
        console.error('Error initializing popup:', error);
    }
}

async function openTextAreaList() {
    try {
        // Get current active tab for context
        const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
        const listContent = document.getElementById("list").value;
        
        await openList(listContent, activeTab);
        
        // Check if popup should close after opening
        const result = await chrome.storage.sync.get({ 
            openListOptions: { closePopupAfterOpen: true } 
        });
        
        if (result.openListOptions.closePopupAfterOpen) {
            window.close();
        }
    } catch (error) {
        console.error('Error opening tab list:', error);
    }
}

function setupEventListeners() {
    document.getElementById("openButton").addEventListener("click", openTextAreaList);
    
    // Options link
    document.getElementById("optionsLink").addEventListener("click", function(e) {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });
    
    // Allow Enter key to trigger opening (Ctrl+Enter for multi-line support)
    document.getElementById("list").addEventListener("keydown", function(event) {
        if (event.key === "Enter" && event.ctrlKey) {
            event.preventDefault();
            openTextAreaList();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    initPopup();
    setupEventListeners();
});
