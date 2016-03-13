
// Set up onClick menu item action.
chrome.contextMenus.onClicked.addListener(onClickHandler);
// Set up request application action.
chrome.extension.onRequest.addListener(onRequestHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(addContext);
// Set up context menu tree at browser startup.
chrome.runtime.onStartup.addListener(addContext);

function addContext() {
	chrome.contextMenus.create({"title": chrome.i18n.getMessage("menuPageContxt"), "id": "pagecontext"});
	chrome.contextMenus.create({"title": chrome.i18n.getMessage("menuImageContxt"), "contexts": ["image"], "id": "imagecontext"});
}

function link(href) {
	var a = document.createElement('a');
		a.href = href;
	return a;
}

function onClickHandler(info, tab) {
	if (info.menuItemId === 'imagecontext' && link(info.srcUrl).host !== link(info.pageUrl).host) {
		onRequestHandler({event: 'XHR', uri: info.srcUrl}, {id: chrome.runtime.id, url: info.pageUrl, tab: tab, frameId: 0}, function(){})
	} else {
		chrome.tabs.sendMessage(tab.id, {
			action: 'pushKat',
			uri: (info.menuItemId === 'imagecontext' ? info.srcUrl : '')
		}, function(){});
	}
}

function onRequestHandler(request, sender, sendResponse) {
	switch (request.event) {
		case 'XHR':
			var xhr = new XMLHttpRequest(); 
				xhr.responseType = 'blob';
				xhr.onreadystatechange = function() { 
					if (this.readyState == 4 && this.status == 200) { 
						var reader = new FileReader();
							reader.onload = function() {
								if (this.readyState > 0) {
									chrome.tabs.sendMessage(sender.tab.id, {
										action: 'pushKat',
										uri: this.result
									});
								}
							}
							reader.readAsDataURL(this.response);
					}
				}
				xhr.open('GET', request.uri, true);
				xhr.send(null);
	}
}
