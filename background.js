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
const TAB_ID_NONE = browser.tabs.TAB_ID_NONE;
const DB_N3       = 'n3kFF';

const Load_Start = Object.create(null);
const Data_Apply = Object.create(null);

const dbStor3 = {
	save: (id, data) => {

		const hash = data.hash;
		const apply = (Data_Apply[id] = data.apply);
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
			Data_Apply[params.id] = params.apply;
	}
});

const _Resolves_ = new Map;
const _Connects_ = new Map;
const addContext = () => {
	browser.contextMenus.create({'title': browser.i18n.getMessage('menuPageContxt'), 'id': 'pagecontext'});
	browser.contextMenus.create({'title': browser.i18n.getMessage('menuImageContxt'), 'contexts': ['image'], 'id': 'imagecontext'});
}

// Set up onClick menu item action.
browser.contextMenus.onClicked.addListener(onClickHandler);
// Set up request application action.
browser.runtime.onMessage.addListener(onMessageHandler);
// Set up context menu tree at install time.
browser.runtime.onInstalled.addListener(addContext);
// Set up context menu tree at browser startup.
browser.runtime.onStartup.addListener(addContext);
// Set up open/reload tab handler.
if (SUPPORT_TAB_FILTERS) {
	browser.tabs.onUpdated.addListener(onStatusUpdate, {
		urls: ['http://*/*', 'https://*/*', 'file:///*/*'],
		properties: ['status']
	});
} else {
	browser.tabs.onUpdated.addListener(onStatusUpdate);
}

function onStatusUpdate(tab_id, { status, url }) {
	switch (status) {
		case 'loading':
			if (!url)
				_Connects_.delete(tab_id);
			if (!Load_Start[tab_id] && (!SUPPORT_TAB_FILTERS || !!url)) {
				if (Data_Apply[tab_id])
					_Connects_.set(tab_id, InjectScripts(tab_id));
				Load_Start[tab_id] = true;
			}
			break;
		case 'complete':
			if (Data_Apply[tab_id])
				browser.tabs.sendMessage(tab_id, { action: 'put3kon', data: true });
			Load_Start[tab_id] = false;
	}
}

function onClickHandler({ menuItemId, pageUrl, srcUrl }, tab) {

	var href = '', needload = false;

	switch (menuItemId) {
		case 'imagecontext':
			var { protocol, host, href } = new URL(srcUrl);
			var needload = (
				protocol !== 'data:' && host !== new URL(pageUrl).host
			);
		case 'pagecontext':
			sendDataTo(tab.id, href, needload);
	}
}

function onMessageHandler({ name, data }, { tab }) {
	const tab_id = tab.id;
	switch (name) {
		case 'n3kon3kt':
			dbStor3.load(tab_id).then(params => {
				browser.tabs.sendMessage(tab_id, {
					action : 'initMe',
					data   : params
				});
			});
			_Resolves_.get(tab_id)();
			_Resolves_.delete(tab_id);
			break;
		case'upd:3plz':
			dbStor3.purge(tab_id);
		case 'save:3plz':
			dbStor3.save(tab_id, data);
			break;
		case 'image:3plz':
			sendDataTo(tab_id, data, true);
	}
}

function sendDataTo(tab_id = TAB_ID_NONE, url = '', needload = false) {

	const isReady = _Connects_.has(tab_id),
	     tabReady = isReady ? _Connects_.get(tab_id) : InjectScripts(tab_id);

	if (!isReady)
		_Connects_.set(tab_id, tabReady);
	if (needload) {
		LoadDataHTTP(url).then(base64 => {
			tabReady.then(() => {
				browser.tabs.sendMessage(tab_id, {
					action : 'pushKat',
					data   : base64
				});
			});
		});
	} else {
		tabReady.then(() => {
			browser.tabs.sendMessage(tab_id, {
				action : 'pushKat',
				data   : url 
			});
		});
	}
}

function InjectScripts(tab_id = TAB_ID_NONE) {
	return new Promise(resolve => {
		_Resolves_.set(tab_id, resolve);
		browser.tabs.insertCSS(tab_id, {
			allFrames: false, file: '/pasL/pasL.css'
		});
		browser.tabs.executeScript(tab_id, {
			allFrames: false, file: '/pasL/pasL.js'
		});
		browser.tabs.insertCSS(tab_id, {
			allFrames: false, file: 'content_styles.css'
		});
		browser.tabs.executeScript(tab_id, {
			allFrames: false, file: 'content_script.js'
		});
	});
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
		const dbReq = indexedDB.open(DB_N3, 1); // db version
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
