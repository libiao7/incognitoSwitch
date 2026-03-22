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
                                chrome.tabs.update(tabs[tabs.length-1].id, { active: true })
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
            state:'maximized',
            incognito: !incognito,
            url: url
        });
    })
}

chrome.browserAction.onClicked.addListener((tab) => {
    createNewTabInOppositeMode(tab.url, tab.incognito);
    // chrome.tabs.remove(tab.id);
});

chrome.contextMenus.create({
    id: "incognitoornot",
    title: "Open Link in Incognito/Normal Window",
    contexts: ["page", "link"],
    onclick: (info, tab) => {
        createNewTabInOppositeMode(info.linkUrl || info.pageUrl, tab.incognito);
    }
});
chrome.contextMenus.create({
    title: "Search text in Incognito/Normal Window",
    contexts: ["selection"],
    onclick: (info, tab) => {
        createNewTabInOppositeMode("https://www.google.com/search?q=" + encodeURIComponent(info.selectionText), tab.incognito);
    }
});
