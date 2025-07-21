// Options page functionality

const DEFAULT_OPTIONS = {
    searchEngine: 'https://www.google.com/search?q=',
    autoHttps: true,
    handleRelativeUrls: true,
    focusFirstTab: false,
    closePopupAfterOpen: true,
    blockUnsafeSchemas: true
};

async function saveOptions() {
    const options = {
        searchEngine: document.getElementById('searchEngine').value,
        autoHttps: document.getElementById('autoHttps').checked,
        handleRelativeUrls: document.getElementById('handleRelativeUrls').checked,
        focusFirstTab: document.getElementById('focusFirstTab').checked,
        closePopupAfterOpen: document.getElementById('closePopupAfterOpen').checked,
        blockUnsafeSchemas: document.getElementById('blockUnsafeSchemas').checked
    };
    
    try {
        await chrome.storage.sync.set({ openListOptions: options });
        
        // Show success message
        const status = document.getElementById('status');
        status.textContent = 'Options saved!';
        setTimeout(() => {
            status.textContent = '';
        }, 2000);
    } catch (error) {
        console.error('Error saving options:', error);
    }
}

async function loadOptions() {
    try {
        const result = await chrome.storage.sync.get({ openListOptions: DEFAULT_OPTIONS });
        const options = result.openListOptions;
        
        document.getElementById('searchEngine').value = options.searchEngine;
        document.getElementById('autoHttps').checked = options.autoHttps;
        document.getElementById('handleRelativeUrls').checked = options.handleRelativeUrls;
        document.getElementById('focusFirstTab').checked = options.focusFirstTab;
        document.getElementById('closePopupAfterOpen').checked = options.closePopupAfterOpen;
        document.getElementById('blockUnsafeSchemas').checked = options.blockUnsafeSchemas;
    } catch (error) {
        console.error('Error loading options:', error);
        // If there's an error, use defaults
        resetToDefaults();
    }
}

function resetToDefaults() {
    document.getElementById('searchEngine').value = DEFAULT_OPTIONS.searchEngine;
    document.getElementById('autoHttps').checked = DEFAULT_OPTIONS.autoHttps;
    document.getElementById('handleRelativeUrls').checked = DEFAULT_OPTIONS.handleRelativeUrls;
    document.getElementById('focusFirstTab').checked = DEFAULT_OPTIONS.focusFirstTab;
    document.getElementById('closePopupAfterOpen').checked = DEFAULT_OPTIONS.closePopupAfterOpen;
    document.getElementById('blockUnsafeSchemas').checked = DEFAULT_OPTIONS.blockUnsafeSchemas;
}

async function resetOptions() {
    resetToDefaults();
    await saveOptions();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadOptions();
    
    document.getElementById('save').addEventListener('click', saveOptions);
    document.getElementById('reset').addEventListener('click', resetOptions);
    
    // Auto-save on change
    document.addEventListener('change', saveOptions);
});