var _App = (typeof browser !== 'undefined' ? browser : chrome);

// Set up onClick menu item action.
_App.contextMenus.onClicked.addListener(onClickHandler);
// Set up request application action.
_App.runtime.onMessage.addListener(onMessageHandler);

// Set up context menu tree at install time.
_App.runtime.onInstalled.addListener(addContext);
// Set up context menu tree at browser startup.
_App.runtime.onStartup.addListener(addContext);

function addContext() {
	_App.contextMenus.create({'title': _App.i18n.getMessage('menuPageContxt'), 'id': 'pagecontext'});
	_App.contextMenus.create({'title': _App.i18n.getMessage('menuImageContxt'), 'contexts': ['image'], 'id': 'imagecontext'});
}

function link(href) {
	var a = document.createElement('a');
		a.href = href;
	return a;
}

function stubFn() {}

function onClickHandler(info, tab) {
	switch (info.menuItemId) {
		case 'imagecontext':
			var pg_host = link(info.pageUrl).host,
				img_host = link(info.srcUrl).host || pg_host;
			if (img_host !== pg_host) {
				onMessageHandler({ uri: info.srcUrl }, { id: _App.runtime.id, url: info.pageUrl, tab: tab, frameId: 0 }, stubFn);
				break;
			}
		case 'pagecontext':
			_App.tabs.sendMessage(tab.id, {
				action: 'pushKat',
				uri: info.srcUrl
			}, stubFn);
	}
}

function onMessageHandler(request, sender, sendResponse) {
	var xhr = new XMLHttpRequest(); 
		xhr.responseType = 'blob';
		xhr.onreadystatechange = function() { 
			if (this.readyState == 4 && this.status == 200) { 
				var reader = new FileReader();
					reader.onload = function() {
						if (this.readyState === FileReader['DONE']) {
							_App.tabs.sendMessage(sender.tab.id, {
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
