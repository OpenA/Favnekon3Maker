
const dataSaved = {};
const tComplete = {};

if (typeof browser === 'undefined') {
	var browser  = chrome;
}

const DB_N3 = true ? 'n3kFF' : `
 |\-/\..--.
  _ _   ,  ;
 = ^ =_|../`;

const dbStor3 = {
	save: (id, data) => {

		const db = kon3ktDB();
		const st = Object.assign({ id }, data);
		var hash = 0, pixelData = Uint8ClampedArray.from(data.pixelData);

		for (let i = 0; i < pixelData.length; i++) {
			hash += pixelData[i] + i;
		}
		st.pixelData = hash;

		db.then(db => {
			const tr = db.transaction(['n3cons', 'tabs_params'], 'readwrite');
			tr.objectStore('n3cons').add({ hash, pixelData });
			tr.objectStore('tabs_params').put(st);
		});
	},
	load: (id) => new Promise((resolve, reject) => {
		kon3ktDB().then(db => {
			const tr = db.transaction(['n3cons', 'tabs_params'], 'readonly');
			const tab_pr = id === undefined ?
				tr.objectStore('tabs_params').getAll() :
				tr.objectStore('tabs_params').get( id );
			tab_pr.onerror = () => reject(tab_pr.error)
			tab_pr.onsuccess = id === undefined ? () => Promise.all(
				tab_pr.result.map(data => new Promise(ok => {
					const n3cor = tr.objectStore('n3cons').get(data.pixelData);
					n3cor.onerror = () => console.error(data, n3cor.error);
					n3cor.onsuccess = () => {
						dataSaved[data.id] = {
							pixelData: Array.from(n3cor.result.pixelData)
						}
						for (key in data) {
							if (key != 'id' && key != 'pixelData')
								dataSaved[data.id][key] = data[key];
						}
						ok();
					}
				}))
			).then(resolve) : ({ target: { result } }) => {
				const n3cor = tr.objectStore('n3cons').get(result.pixelData);
				n3cor.onerror = () => reject(n3cor.error);
				n3cor.onsuccess = () => {
					var out = Object.assign({}, result);
					out.pixelData = Array.from(n3cor.result.pixelData);
					resolve(out);
				}
			};
		});
	}),
	purge: (id) => {
		kon3ktDB().then(db => {
			const tr = db.transaction(['tabs_params'], 'readwrite');
			/*------*/ tr.objectStore( 'tabs_params' ).delete( id );
		});
	}
};

const onSDLoad   = dbStor3.load();
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
browser.tabs.onUpdated.addListener((tab_id, { status, url }) => {
	switch (status) {
		case 'loading':
			if (tab_id in tComplete)
				delete tComplete[tab_id];
			url && onSDLoad.then(() => {
				if (tab_id in dataSaved && dataSaved[tab_id].apply)
					InjectScripts(tab_id);
			});
			break;
		case 'complete':
			break;
	}
}, {
	urls: ['<all_urls>'],
	properties: ['status']
});

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
	switch (name) {
		case 'n3kon3kt':
			browser.tabs.sendMessage(tab.id, {
				action: 'initMe',
				data: Object.assign({}, dataSaved[tab.id])
			});
			tComplete[tab.id].ok();
			break;
		case 'purge:3plz':
			delete dataSaved[tab.id];
			dbStor3.purge(tab.id);
			break;
		case 'save:3plz':
			dataSaved[tab.id] = data;
			dbStor3.save(tab.id, data);
			break;
		case 'image:3plz':
			sendDataTo(tab.id, data, true);
	}
}

function sendDataTo(tab_id, data, needload) {

	const onInject = tab_id in tComplete ? tComplete[tab_id] : InjectScripts(tab_id);

	if (needload) {
		LoadDataHTTP(data).then(base64 => {
			onInject.then(() => {
				browser.tabs.sendMessage(tab_id, {
					action: 'pushKat', data: base64
				});
			});
		});
	} else {
		onInject.then(() => {
			browser.tabs.sendMessage(tab_id, {
				action: 'pushKat', data
			});
		});
	}
}

function InjectScripts(tab_id) {
	var complete = null;
	const promise = new Promise(resolve => {
		complete = resolve;
		browser.tabs.insertCSS(tab_id, {
			allFrames: false,
			file: 'content_styles.css'
		});
		browser.tabs.executeScript(tab_id, {
			allFrames: false,
			file: 'content_script.js'
		});
	});
	promise.ok = () => complete();
	return (tComplete[tab_id] = promise);
}

function LoadDataHTTP(url) {
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
