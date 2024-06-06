
const favn3kon = new class extends Favn3kon {

	constructor() {
		super().styles.push(
			chrome.runtime.getURL('content_styles.css'),
			chrome.runtime.getURL('tools/draww/pasL/pasL.css')
		);
		this.requ3st();
	}

	requ3st(req = '', data = null) {
		let kon3kt = this.n3kon3kt;
		if(!kon3kt) {
			kon3kt = this.n3kon3kt = new Promise(resolve => {
				const port = chrome.runtime.connect();
				port.onMessage.addListener(o => this.handleMsg(o));
				port.onDisconnect.addListener(() => {
					this.n3kon3kt = null;
				});
				resolve(port);
			});
		}
		if (req) {
			kon3kt.then(port => port.postMessage({ action: req, data }));
		}
	}

	handleMsg({ action, data }) {
		switch(action) {
		case 'init:3now':
			this.init3m(data);
			break;
		case 'open:3now':
			document.body.append(this.overlay);
			if (!data)
				break;
		case 'load:3now':
			this.reloadImage(null, data);
			break;
		}
	}
};
