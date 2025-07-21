# OpenList Chrome Extension

OpenList helps you manage lists of URLs. It's useful if you have a habit of emailing yourself lists of articles or pages to check out later.

With OpenList, you can:

* select a list of URLs (or search terms) in any web page or textarea, then open them all in new tabs
* paste a list of URLs (or search terms) into a popup, then open them all in new tabs
* get a list of all tabs in the current window
* use custom tab titles with the format `[title] URL`
* handle relative URLs using the current tab's domain
* configure search engines and security preferences

## ✨ New in v0.4.0 - Manifest V3 Update

This version brings full Chrome Manifest V3 compatibility and several new features:

### 🔧 Technical Improvements
- **Manifest V3 Compatibility**: Fully updated for modern Chrome extensions
- **Service Worker**: Replaced background page with efficient service worker
- **Modern APIs**: Updated to use current Chrome extension APIs
- **Enhanced Security**: Improved URL validation and schema filtering

### 🎯 New Features
- **Custom Tab Titles**: Use `[Custom Title] URL` format to set tab titles
- **Relative URL Support**: Automatically resolve relative URLs using current tab's domain
- **Multiple Search Engines**: Choose from Google, Bing, DuckDuckGo, or Yahoo
- **Security Filtering**: Automatically blocks unsafe URL schemas
- **Options Page**: Comprehensive settings for customizing behavior

### 🎨 UI Improvements
- **Modern Design**: Clean, accessible interface following Chrome design guidelines
- **Keyboard Shortcuts**: Use Ctrl+Enter to quickly open tabs
- **Better Feedback**: Helpful tooltips and placeholder text
- **Responsive Layout**: Improved popup layout and typography

## Installation

[Download the extension from the Chrome store](https://chrome.google.com/webstore/detail/nkpjembldfckmdchbdiclhfedcngbgnl). It's free!

*Note: The Chrome store version may not yet include the v0.4.0 Manifest V3 updates. For the latest version, you can load the extension manually from this repository.*

## Manual Installation (Development)

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `extension` folder

## Usage

### Basic Usage
1. Click the OpenList icon in your browser toolbar
2. Paste or type URLs/search terms, one per line
3. Click "Open" or press Ctrl+Enter

### Advanced Features

#### Custom Tab Titles
```
[GitHub] https://github.com
[News] https://news.ycombinator.com
Regular URL without title
```

#### Relative URLs
When browsing `https://example.com/page/`, these relative URLs will work:
```
/about          → https://example.com/about
../contact      → https://example.com/contact
./images/pic.jpg → https://example.com/page/images/pic.jpg
```

#### Context Menu
Select text on any webpage and right-click → "OpenList" to open the selected URLs.

### Options

Access the options page via the "Options" link in the popup to configure:

- **Search Engine**: Choose your preferred search engine for non-URL text
- **URL Handling**: Configure HTTPS preferences and relative URL resolution
- **Tab Behavior**: Control tab focusing and popup closing behavior
- **Security**: Configure URL schema filtering

## Issues

Please open an issue on [the GitHub issue tracker for this project](https://github.com/eduardklinger/TabList/issues).

## History

* **v0.4.0**: Manifest V3 migration, custom tab titles, relative URL support, options page, UI improvements
* v0.3.3: remove redundant addition of context menu item
* v0.3.2: use Chrome event page instead of persistent background page, for reduced resource usage
* v0.3.1: fix a bug where Open button sometimes didn't work; appearance updates.
* v0.3: compatibility and security improvements; new icon.
* v0.2.2 removes warning when opening many tabs; this caused problems in some cases, and Chrome handles it decently well.
* v0.2 adds list generation capability & popup to enter a list from elsewhere; improves URL detection
* v0.1 initial release

## Security

OpenList v0.4.0 includes enhanced security features:

- **Schema Filtering**: Blocks potentially unsafe URL schemas (file://, javascript:, etc.)
- **Input Validation**: Proper sanitization of user input
- **Relative URL Safety**: Secure resolution of relative URLs
- **User Control**: Configurable security settings

## License

MIT. See `LICENSE` included in this repo.

## Developer

* [chris.dzombak.name](http://chris.dzombak.name/)
* chris@chrisdzombak.net
* [t@cdzombak](https://twitter.com/cdzombak)
* [a@dzombak](https://alpha.app.net/dzombak)
