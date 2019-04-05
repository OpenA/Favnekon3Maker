
const dataSaved = {};
const openPorts = {};

if (typeof browser === 'undefined') {
	var browser  = chrome;
	var Storage  = chrome.storage.local;
	var Tabs     = chrome.tabs;
	var onSDLoad = new Promise (resolve => { Storage.get(null, resolve) });
} else {
	var Storage  = browser.storage.local;
	var Tabs     = browser.tabs;
	var onSDLoad = Storage.get(null);
}

onSDLoad.then(stor => { Object.assign(dataSaved, stor); });
// Set up onClick menu item action.
browser.contextMenus.onClicked.addListener(onClickHandler);
// Set up request application action.
browser.runtime.onMessage.addListener(onMessageHandler);
// Set up context menu tree at install time.
browser.runtime.onInstalled.addListener(addContext);
// Set up context menu tree at browser startup.
browser.runtime.onStartup.addListener(addContext);
// Set up open/reload tab handler.
Tabs.onUpdated.addListener((tab_id, { status }) => {
	switch (status) {
		case 'loading':
			if (tab_id in openPorts)
				delete openPorts[tab_id];
			onSDLoad.then(() => {
				if (tab_id in dataSaved && dataSaved[tab_id].apply)
					InjectScripts(tab_id);
			});
			break;
		case 'complete':
			break;
	}
});

function addContext() {
	browser.contextMenus.create({'title': browser.i18n.getMessage('menuPageContxt'), 'id': 'pagecontext'});
	browser.contextMenus.create({'title': browser.i18n.getMessage('menuImageContxt'), 'contexts': ['image'], 'id': 'imagecontext'});
}

function link(href) {
	var a = document.createElement('a');
		a.href = href;
	return a;
}

function onClickHandler({ menuItemId, pageUrl, srcUrl }, tab) {
	switch (menuItemId) {
		case 'imagecontext':
			var pg_host = link(pageUrl).host,
				img_host = link(srcUrl).host || pg_host;
			if (img_host !== pg_host) {
				onMessageHandler({
					name: 'image:3plz',
					uri: srcUrl
				}, { tab });
				break;
			}
		case 'pagecontext':
			if (tab.id in openPorts)
				sendDataTo(tab.id, srcUrl);
			else
				InjectScripts(tab.id).then(sendDataTo.bind(null, tab.id, srcUrl));
	}
}

function onMessageHandler({ name, data }, { tab }) {
	switch (name) {
		case 'n3kon3kt':
			Tabs.sendMessage(tab.id, {
				action: 'initMe',
				data: dataSaved[tab.id] || {}
			});
			openPorts[tab.id]();
			break;
		case 'purge:3plz':
			delete dataSaved[tab.id];
			Storage.remove(tab.id);
			break;
		case 'save:3plz':
			dataSaved[tab.id] = data;
			Storage.set(dataSaved);
			break;
		case 'image:3plz':
			let jec = tab.id in openPorts ? Promise.resolve() : InjectScripts(tab.id);
			let xhr = new XMLHttpRequest;
				xhr.responseType = 'blob';
				xhr.onload = ({ target: { response } }) => {
					let reader = new FileReader;
						reader.onload = ({ target: { result, readyState } }) => {
							if (readyState === FileReader.DONE) {
								jec.then(sendDataTo.bind(null, tab.id, result));
							}
						}
						reader.readAsDataURL(response);
				}
				xhr.open('GET', data, true);
				xhr.send(null);
	}
}

function sendDataTo(tab_id, data) {
	Tabs.sendMessage(tab_id, {
		action: 'pushKat', data
	});
}

function InjectScripts(tab_id) {
	return new Promise (resolve => {
		Tabs.insertCSS(tab_id, {
			allFrames: false,
			file: 'content_styles.css'
		});
		openPorts[tab_id] = resolve;
		Tabs.executeScript(tab_id, {
			allFrames: false,
			file: 'content_script.js'
		});
	});
}
