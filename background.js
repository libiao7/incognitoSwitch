function createNewTabInOppositeMode(url, incognito) {
    chrome.windows.getAll({
        windowTypes: ["normal"]
    }, windows => {
        for (var i = 0; i < windows.length; i++) {
            if (windows[i].incognito != incognito) {
                chrome.tabs.query({
                    windowId: windows[i].id,
                    url: url
                }, function (tabs) {
                    chrome.windows.update(
                        windows[i].id,
                        { focused: true },
                        function () {
                            if (tabs.length > 0)
                                chrome.tabs.update(tabs[tabs.length - 1].id, { active: true })
                            else if (tabs.length == 0)
                                chrome.tabs.create({
                                    windowId: windows[i].id,
                                    url: url,
                                    active: true
                                });
                        }
                    )
                })
                return;
            }
        }
        chrome.windows.create({
            state: 'maximized',
            incognito: !incognito,
            url: url
        });
    })
}

chrome.action.onClicked.addListener((tab) => {
    createNewTabInOppositeMode(tab.url, tab.incognito);
    // chrome.tabs.remove(tab.id);
});
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "Open Link in Incognito Or Normal Window",
        title: "Open Link in Incognito Or Normal Window",
        contexts: ["page", "link"]
    });
    chrome.contextMenus.create({
        id: "Search text in Incognito Or Normal Window",
        title: "Search text in Incognito Or Normal Window",
        contexts: ["selection"]
    });
});
chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        if (info.menuItemId === "Open Link in Incognito Or Normal Window")
            createNewTabInOppositeMode(info.linkUrl || info.pageUrl, tab.incognito);
    }
)
chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        if (info.menuItemId === "Search text in Incognito Or Normal Window")
            createNewTabInOppositeMode("https://www.google.com/search?q=" + encodeURIComponent(info.selectionText), tab.incognito);
    }
)
