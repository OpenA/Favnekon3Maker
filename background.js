
const openPorts = {};

// Set up onClick menu item action.
chrome.contextMenus.onClicked.addListener(onClickHandler);
// Set up request application action.
chrome.runtime.onMessage.addListener(onMessageHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(addContext);
// Set up context menu tree at browser startup.
chrome.runtime.onStartup.addListener(addContext);

chrome.runtime.onConnect.addListener(port => {
	const id = port.sender.tab.id;
	openPorts[id] = port;
	port.onDisconnect.addListener(() => {
		delete openPorts[id];
	});
});

function addContext() {
	chrome.contextMenus.create({'title': chrome.i18n.getMessage('menuPageContxt'), 'id': 'pagecontext'});
	chrome.contextMenus.create({'title': chrome.i18n.getMessage('menuImageContxt'), 'contexts': ['image'], 'id': 'imagecontext'});
}

function link(href) {
	var a = document.createElement('a');
		a.href = href;
	return a;
}

function onClickHandler(info, tab) {
	switch (info.menuItemId) {
		case 'imagecontext':
			var pg_host = link(info.pageUrl).host,
				img_host = link(info.srcUrl).host || pg_host;
			if (img_host !== pg_host) {
				onMessageHandler(info.srcUrl, { tab });
				break;
			}
		case 'pagecontext':
			openPorts[tab.id].postMessage({
				action: 'pushKat',
				data: info.srcUrl
			});
	}
}

function onMessageHandler(url, { tab: { id } }) {
	let xhr = new XMLHttpRequest; 
		xhr.responseType = 'blob';
		xhr.onload = () => {
			let reader = new FileReader;
				reader.onload = function() {
					if (this.readyState === FileReader.DONE) {
						openPorts[id].postMessage({
							action: 'pushKat',
							data: this.result
						});
					}
				}
				reader.readAsDataURL(xhr.response);
		}
		xhr.open('GET', url, true);
		xhr.send(null);
}
