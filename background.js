/*
  |\-/\..--.
   _ _   ,  ;
  = ^ =_|../
*/
if (typeof browser === 'undefined') {
	var browser = chrome;
	var SUPPORT_TAB_FILTERS = false;
} else {
	let [, major = 0] = navigator.userAgent.match(/Firefox\/(\d+)\./);
	var SUPPORT_TAB_FILTERS = Number(major) >= 61;
}
const _Applies_  = Object.create(null);
const _Resolves_ = Object.create(null);
const _Connects_ = new Map;

const dbStor3 = {
	save: (id, data) => {

		const hash = data.hash;
		const apply = (_Applies_[id] = data.apply);
		const pixelData = Uint8ClampedArray.from(data.pixelData);

		kon3ktDB().then(db => {
			db.transaction('n3cons', 'readwrite')
			  .objectStore('n3cons').add({ hash, pixelData });
			db.transaction('tabs_params', 'readwrite')
			  .objectStore('tabs_params').put({
				  id, apply,
				  colorAjusts : data.colorAjusts,
				  brightness  : data.brightness,
				  pixelData   : hash
			  });
		});
	},
	load: (id) => new Promise((resolve, reject) => {
		kon3ktDB().then(db => {
			const tr = db.transaction(['n3cons', 'tabs_params'], 'readonly');
			const tab_pr = tr.objectStore('tabs_params').get( id );
			tab_pr.onerror = () => reject(tab_pr.error);
			tab_pr.onsuccess = () => {
				const params = {};
				if (tab_pr.result) {
					const hash = tab_pr.result.pixelData,
					     n3cor = tr.objectStore('n3cons').get(hash);
					n3cor.onerror = () => reject(n3cor.error);
					n3cor.onsuccess = () => {
						if (n3cor.result) {
							params.hash        = hash;
							params.apply       = tab_pr.result.apply;
							params.brightness  = tab_pr.result.brightness;
							params.colorAjusts = tab_pr.result.colorAjusts;
							params.pixelData   = Array.from(n3cor.result.pixelData);
						}
						resolve(params);
					}
				} else
					resolve(params);
			}
		});
	}),
	purge: (id) => {
		kon3ktDB().then(db => {
			db.transaction('tabs_params', 'readonly')
			  .objectStore('tabs_params').get(id).onsuccess = ({ target: { result } }) => {
				if (result) {
					db.transaction('n3cons', 'readwrite')
					  .objectStore('n3cons').delete(result.pixelData);
				}
			}
		});
	}
};

// Load stored tab params
kon3ktDB().then(db => {
	const tr = db.transaction(['tabs_params'], 'readonly');
	const tab_pr = tr.objectStore('tabs_params').getAll();
	tab_pr.onsuccess = () => {
		for (const params of tab_pr.result)
			_Applies_[params.id] = params.apply;
	}
});

// Set up connections between content and background
browser.runtime.onConnect.addListener(port => {
	const id = port.sender.tab.id,
	     res = _Resolves_[id];
	port.onMessage.addListener(onMessageHandler);
	port.onDisconnect.addListener(() => {
		_Connects_.delete(id);
	});
	dbStor3.load(id).then(data => {
		port.postMessage({ action: 'initM3', data });
	});
	if (res) res(port);
	delete _Resolves_[id];
});

const addContext = () => {
	browser.contextMenus.create({'title': browser.i18n.getMessage('menuPageContxt'), 'id': 'pagecontext'});
	browser.contextMenus.create({'title': browser.i18n.getMessage('menuImageContxt'), 'contexts': ['image'], 'id': 'imagecontext'});
	browser.contextMenus.create({'title': 'draww', 'id': 'drawwcontext'});
}

const onTabUpdate = (tab_id, tab_p) => {
	const { status } = tab_p;

	if (status === 'complete' && _Applies_[tab_id]) {
		getConnect(tab_id).then(port => {
			port.postMessage({ action: 'put3kon', data: true })
		});
	}
};

const execScripts = (tab_id, at, js_list) => Promise.all(
	js_list.map(file => browser.tabs.executeScript(tab_id, {
		allFrames: false, runAt: 'document_'+ at, file
	}))
);

// Set up onClick menu item action.
browser.contextMenus.onClicked.addListener(onClickHandler);
// Set up context menu tree at install time.
browser.runtime.onInstalled.addListener(addContext);
// Set up context menu tree at browser startup.
browser.runtime.onStartup.addListener(addContext);
// Set up open/reload tab handler.
if (SUPPORT_TAB_FILTERS)
	browser.tabs.onUpdated.addListener(onTabUpdate, { properties: ['status'] });
else
	browser.tabs.onUpdated.addListener(onTabUpdate);

function onClickHandler({ menuItemId, pageUrl, srcUrl }, tab) {

	var href = '', needload = false;

	switch (menuItemId) {
		case 'drawwcontext':
			browser.tabs.create({
				url: browser.runtime.getURL('tools/draww/editor.html'), active: true
			});
			break;
		case 'imagecontext':
			var { protocol, host, href } = new URL(srcUrl);
			var needload = (
				protocol !== 'data:' && host !== new URL(pageUrl).host
			);
		case 'pagecontext':
			Promise.all([
				getConnect(tab.id), (needload ? LoadDataHTTP(href) : href)
			]).then(([port, uri]) => {
				port.postMessage({ action : 'pushKat', data: uri });
			});
	}
}

function onMessageHandler({ action, data }, port) {
	const tab_id = port.sender.tab.id;
	switch (action) {
		case'upd:3plz':
			dbStor3.purge(tab_id);
		case 'save:3plz':
			dbStor3.save(tab_id, data);
			break;
		case 'image:3plz':
			LoadDataHTTP(data).then(base64 => {
				port.postMessage({ action: 'pushKat', data: base64 });
			});
	}
}

function getConnect(tab_id = -1) {

	if (tab_id < 0)
		return Promise.reject();
	if (_Connects_.has(tab_id))
		return _Connects_.get(tab_id);

	const promise = new Promise(resolve => {
		_Resolves_[tab_id] = resolve;
		browser.tabs.insertCSS(tab_id, {
			allFrames: false, runAt: 'document_start',
			file: 'tools/draww/pasL/pasL.css'
		});
		execScripts(tab_id, 'start', [
			'tools/draww/js/moriya-tools.js',
			'tools/draww/pasL/pasL.js'
		]).then(() => {
			browser.tabs.insertCSS(tab_id, {
				allFrames: false, runAt: 'document_idle',
				file: 'content_styles.css'
			});
			browser.tabs.executeScript(tab_id, {
				allFrames: false, runAt: 'document_idle',
				file: 'content_script.js'
			});
		});
	});
	_Connects_.set(tab_id, promise);
	return promise;
}

function LoadDataHTTP(url = '') {
	return new Promise ((resolve, reject) => {
		let xhr = new XMLHttpRequest;
			xhr.responseType = 'blob';
			xhr.onerror = () => reject();
			xhr.onload = ({ target: { response } }) => {
				let reader = new FileReader;
					reader.onload = ({ target: { result, readyState, error } }) => {
						readyState === FileReader.DONE ? resolve(result) : reject(error);
					}
					reader.onerror = reject;
					reader.readAsDataURL(response);
			}
			xhr.open('GET', url, true);
			xhr.send(null);
	});
}

function kon3ktDB() {
	return new Promise((resolve, reject) => {
		const dbReq = indexedDB.open('n3kFF', 1); // db version
		dbReq.onerror = () => reject(dbReq.error);
		dbReq.onsuccess = () => resolve(dbReq.result);
		dbReq.onupgradeneeded = () => {
			const db = dbReq.result;
			if (!db.objectStoreNames.contains('n3cons')) { // this is a raw pixel data storage
				db.createObjectStore('n3cons', { keyPath: 'hash' });
			}
			if (!db.objectStoreNames.contains('tabs_params')) { // this is a tab params obj storage
				db.createObjectStore('tabs_params', { keyPath: 'id' }); // means you can get and put data by id
			}
			/* before delete some store, u must change the db version
			   for dispatch 'upgradeneeded' event and run this code:
			
			if (db.objectStoreNames.contains('old_store')) {
				db.deleteObjectStore('old_store');
			}*/
		}
	});
}
