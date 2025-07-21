// Utility functions for OpenList extension

// Safe URL schemas that are allowed to be opened
const ALLOWED_SCHEMAS = ['http:', 'https:', 'ftp:', 'chrome:', 'chrome-extension:', 'about:'];

function isProbablyUrl(string) {
    const lower = string.toLowerCase().trim();
    
    // Check for common URL prefixes
    if (lower.startsWith('www.')) return true;
    if (lower.startsWith('ftp:')) return true;
    if (lower.startsWith('http:')) return true;
    if (lower.startsWith('https:')) return true;
    if (lower.startsWith('chrome:')) return true;
    if (lower.startsWith('chrome-extension:')) return true;
    if (lower.startsWith('about:')) return true;
    
    // Check for domain-like patterns (contains dot and no spaces)
    if (lower.includes('.') && !lower.includes(' ') && lower.indexOf('.') > 0) {
        return true;
    }
    
    return false;
}

function isValidSchema(url) {
    try {
        const urlObj = new URL(url);
        return ALLOWED_SCHEMAS.includes(urlObj.protocol);
    } catch (e) {
        return false;
    }
}

function parseUrlWithTitle(line) {
    const trimmed = line.trim();
    
    // Check for [title] URL format
    const titleMatch = trimmed.match(/^\[([^\]]+)\]\s+(.+)$/);
    if (titleMatch) {
        return {
            title: titleMatch[1].trim(),
            url: titleMatch[2].trim()
        };
    }
    
    return {
        title: null,
        url: trimmed
    };
}

function makeAbsoluteUrl(url, currentTabUrl) {
    try {
        // If it's already absolute, return as-is
        if (url.includes('://') || url.startsWith('//')) {
            return url;
        }
        
        // If it starts with /, it's relative to the domain
        if (url.startsWith('/')) {
            const currentUrl = new URL(currentTabUrl);
            return currentUrl.protocol + '//' + currentUrl.host + url;
        }
        
        // Otherwise, it's relative to the current path
        if (currentTabUrl) {
            const currentUrl = new URL(currentTabUrl);
            const basePath = currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/') + 1);
            return currentUrl.protocol + '//' + currentUrl.host + basePath + url;
        }
        
        return url;
    } catch (e) {
        return url;
    }
}

async function getDefaultSearchEngine() {
    try {
        const result = await chrome.storage.sync.get({ 
            openListOptions: { searchEngine: 'https://www.google.com/search?q=' } 
        });
        return result.openListOptions.searchEngine;
    } catch (error) {
        console.error('Error getting search engine preference:', error);
        return 'https://www.google.com/search?q=';
    }
}

async function getOptions() {
    try {
        const result = await chrome.storage.sync.get({ 
            openListOptions: {
                searchEngine: 'https://www.google.com/search?q=',
                autoHttps: true,
                handleRelativeUrls: true,
                focusFirstTab: false,
                closePopupAfterOpen: true,
                blockUnsafeSchemas: true
            }
        });
        return result.openListOptions;
    } catch (error) {
        console.error('Error getting options:', error);
        return {
            searchEngine: 'https://www.google.com/search?q=',
            autoHttps: true,
            handleRelativeUrls: true,
            focusFirstTab: false,
            closePopupAfterOpen: true,
            blockUnsafeSchemas: true
        };
    }
}

async function openList(list, currentTab = null) {
    const strings = list.split(/\r\n|\r|\n/);
    const currentTabUrl = currentTab ? currentTab.url : null;
    const options = await getOptions();
    
    let focusedFirstTab = false;
    
    for (let i = 0; i < strings.length; i++) {
        const line = strings[i].trim();
        if (line === '') continue;
        
        const parsed = parseUrlWithTitle(line);
        let url = parsed.url;
        
        if (!isProbablyUrl(url)) {
            // If it doesn't look like a URL, search for it
            url = options.searchEngine + encodeURIComponent(url);
        } else {
            // Handle relative URLs if option is enabled
            if (options.handleRelativeUrls && currentTabUrl && !url.includes('://') && !url.startsWith('//')) {
                url = makeAbsoluteUrl(url, currentTabUrl);
            }
            
            // Add protocol if missing for domain-like strings
            if (!url.includes('://') && !url.startsWith('//')) {
                url = (options.autoHttps ? 'https://' : 'http://') + url;
            }
        }
        
        // Security check: only open allowed schemas if option is enabled
        if (options.blockUnsafeSchemas && !isValidSchema(url)) {
            console.warn('Skipping URL with disallowed schema:', url);
            continue;
        }
        
        // Create tab with title if provided
        const tabOptions = {
            url: url,
            active: !focusedFirstTab && options.focusFirstTab
        };
        
        try {
            const newTab = await chrome.tabs.create(tabOptions);
            
            if (!focusedFirstTab && options.focusFirstTab) {
                focusedFirstTab = true;
            }
            
            // If we have a custom title, we could potentially update it
            // Note: Chrome doesn't allow directly setting tab titles, 
            // but we could inject a script to update the page title
            if (parsed.title) {
                // For now, we'll just log it. In a full implementation,
                // we might inject a content script to update the title
                console.log('Tab created with custom title intention:', parsed.title, 'for URL:', url);
            }
        } catch (error) {
            console.error('Failed to create tab for URL:', url, error);
        }
    }
}
