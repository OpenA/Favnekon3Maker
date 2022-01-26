
const Q_HEIGHT = 32;

const Favn3kon = {

	hash : 0,
	apply: false,

	pixelData  : [],
	brightness : -0,
	colorAjusts: [],

	pushKat: (src = '') => {
		imageReset();
		if (src) {
			dropbx.prepend( ldstub, image );
			fetch(src).then(res => res.blob()).then(imageLoad);
		}
		document.body.appendChild(overlay);
	},

	put3kon: (apply = false) => {

		const favicons = document.head.querySelectorAll(`link[rel$="icon"]:not(#${link.id}), link[rel="icon"]:not(#${link.id})`);
		const manifest = document.head.querySelector('link[rel="manifest"]');
		const metaimg  = document.head.querySelector('meta[itemprop="image"]');

		let default_img = '';

		if (favicons.length) {
			default_img = favicons[0].href;
			for(const ico of favicons)
				ico.remove();
		}
		if (metaimg) {
			if(!default_img)
				default_img = metaimg.content;
			metaimg.remove();
		}
		if (manifest) {
			if(!default_img)
				default_img = manifest.href;
			manifest.remove();
		}
		if (default_img) {
			deffav.src = default_img;
		}
		link.href = apply ? canvas.toDataURL() : deffav.src;
		document.head.append(link);
	},

	initM3({ apply, pixelData, brightness, colorAjusts, hash }) {
		if (pixelData) {
			const contxt = canvas.getContext('2d'),
				  pixels = imgDataCpy(contxt, pixelData);

			if (Boolean(colorAjusts.length)) {
				for (let i = 0; i < colorAjusts.length; i++) {
					const name = (this.colorAjusts[i] = colorAjusts[i]);
					ColorFilter[name](pixels.data);
					prefs.children[`nk3__${name}Filter`].classList.add('ch-x-k');
				}
			}
			if (Boolean(brightness)) {
				expose.firstElementChild.style.left = `${ (this.brightness = brightness) + 50 }%`;
				ColorFilter.expose(pixels.data, brightness);
			}
			this.hash = hash;
			Object.assign(this.pixelData, pixelData);
			contxt.putImageData(pixels, 0, 0);

			if((this.apply = apply)) {
				
				deffav.classList.remove('ch-x-k');
				canvas.classList.add('ch-x-k');
			}
		}
		this.put3kon(apply);
	},

	n3kon3kt: null,

	requ3st(req = '', data = null) {
		let kon3kt = this.n3kon3kt;
		if(!kon3kt) {
			kon3kt = this.n3kon3kt = new Promise(resolve => {
				const port = chrome.runtime.connect();
				port.onMessage.addListener(({ action, data }) => {
					this[action](data);
				});
				port.onDisconnect.addListener(() => {
					this.n3kon3kt = null;
				});
				resolve(port);
			});
		}
		if (req) {
			kon3kt.then(port => port.postMessage({ action: req, data }));
		}
	},

	storeData(changes = {}, upd_ico = false) {
		let { apply, hash, pixelData, brightness, colorAjusts } = this;
		
		if ('apply' in changes)
			apply = this.apply = changes.apply;
		if ('brightness' in changes)
			brightness = this.brightness = changes.brightness;
		if ('hash' in changes) {
			hash = this.hash = changes.hash;
			Object.assign(pixelData, (this.pixelData = changes.pixelData));
		}
		link.href = (apply ? canvas.toDataURL() : deffav.src);
		this.requ3st(
			(upd_ico ? 'upd:3plz' : 'save:3plz'),
			{ apply, hash, pixelData, brightness, colorAjusts }
		);
	}
};

const onClick = e => {

	const { target } = e, el_class = target.classList;
	e.stopPropagation();

	switch (el_class[0]) {
	case 'nk3-ico':
		if(!el_class.contains('ch-x-k')) {
			el_class.add('ch-x-k');
			const apply = target === canvas;
			(apply ? deffav : canvas).classList.remove('ch-x-k');
			Favn3kon.storeData({ apply });
		}
		break;
	case 'nk3-filter':
		const name = target.getAttribute('itemprop'),
		   filters = Favn3kon.colorAjusts;
		if (el_class.toggle('ch-x-k')) {
			filters.push(name);
		} else {
			filters.splice(filters.indexOf(name), 1);
		}
		applyFilters(Favn3kon.brightness);
		Favn3kon.storeData();
		break;
	default:
		if (target.id === 'nk3__CloseBtn') {
			overlay.remove();
		}
	}
};

const pasl    = new PasL({ lock: true, edgies: false });

const link    = _setup('link'  , { id: 'nk3__favIkon', rel: 'icon' });
const canvas  = _setup('canvas', { id: 'nk3__Result' , class: 'nk3-ico', width: Q_HEIGHT, height: Q_HEIGHT });
const deffav  = _setup('img'   , { id: 'nk3__Default', class: 'nk3-ico ch-x-k', width: Q_HEIGHT, height: Q_HEIGHT });

const ldstub  = _setup('div' , { style: 'margin-left: 20px; position: absolute;', html: getLoadingIcon() });
const mCard   = _setup('div' , { id: 'nk3__magCard' }, { click: onClick });
const expose  = _setup('div' , { id: 'nk3__Expose' });
const image   = _setup('img' , { id: 'nk3__wkImage', src: '' });
const overlay = _setup('div' , { id: 'nk3__Overlay', style: 'position: fixed; left: 0; top: 0; height: 0; width: 100%; z-index: 999999;'});
const dropbx  = _setup('div' , { id: 'nk3__DropBox', class: 'ci-tab' }, { drop: fileUpload, dragover: e => e.preventDefault() });
const prefs   = _setup('div' , { id: 'nk3__Prefs'  , class: 'ci-tab' });
const urlCinp = _setup('code', { id: 'nk3__Input'  , contentEditable: true }, {
	keydown: e => {
		if (e.key === 'ArrowRight') {
			const comp = e.target.getAttribute('autocomp');
			if (comp) {
				const sel = window.getSelection(),
				    range = sel.getRangeAt(0),
					offs  = sel.anchorNode.length + comp.length;
				sel.anchorNode.appendData(comp);
				e.preventDefault();
				e.target.setAttribute('autocomp', '');
				range.setStart(sel.anchorNode, offs);
				range.setEnd(sel.anchorNode, offs);
			}
		} else if (e.key === 'Enter') {
			const text = e.target.innerText;
			e.preventDefault();
			if (text !== 'clear') {
				e.target.style.color = loadURL(text) ? null : 'red';
			} else
				imageReset();
			e.target.textContent = '';
		}
	},
	input: ({ target }) => {
		const text = target.innerText,
		       cnt = text.length;
		let comp = '';
		if (cnt > 0 && cnt <= 'clear'.length && 'clear'.substring(0,cnt) === text) {
			comp = 'clear'.substring(cnt);
		}
		target.setAttribute('autocomp', comp);
	}
});

mCard.addEventListener(PasL.onEndEvent, () => drawFavnekon(true));
mCard.append(
	urlCinp, prefs, dropbx,
	_setup('div', { id: 'nk3__CloseBtn' })
);
prefs.append(
	canvas, deffav,
	_setup('div', { id: 'nk3__grayFilter'   , class: 'nk3-filter', itemprop: 'gray' }),
	_setup('div', { id: 'nk3__sepiaFilter'  , class: 'nk3-filter', itemprop: 'sepia' }),
	_setup('div', { id: 'nk3__invertFilter' , class: 'nk3-filter', itemprop: 'invert' }),
	_setup('div', { id: 'nk3__kodaFilter'   , class: 'nk3-filter', itemprop: 'koda' }),
	_setup('div', { id: 'nk3__polarFilter'  , class: 'nk3-filter', itemprop: 'polar' }),
	_setup('div', { id: 'nk3__technieFilter', class: 'nk3-filter', itemprop: 'technie' }),
	_setup('div', { id: 'nk3__brownieFilter', class: 'nk3-filter', itemprop: 'brownie' }),
	expose
);
expose.addEventListener('mousedown', barChanger);
expose.append(
	_setup('div'  , { id: 'nk3__exSlider', style: 'background-color: inherit; left: 50%;' }));
dropbx.appendChild(
	_setup('label', { id: 'nk3__dropArrow' })
).append(
	_setup('input', { type: 'file', style: 'display: none;' }, { change: fileUpload })
);
overlay.append( mCard );

Favn3kon.requ3st(); // connect to background

const ColorFilter = {
	// from Fabric.js Image Filters ( original source code http://fabricjs.com/image-filters )
	'gray': (data) => {
		for (let i = 0; i < data.length; i += 4) {
			data[i + 2] = data[i + 1] = data[i] = (0.21 * data[i] + 0.72 * data[i+1] + 0.07 * data[i+2]);
		}
	},
	'sepia': RGB_transform.bind(null, [
		0.393, 0.769, 0.189, 0, 0,
		0.349, 0.686, 0.168, 0, 0,
		0.272, 0.534, 0.131, 0, 0,
		0, 0, 0, 1, 0
	]),
	'polar': RGB_transform.bind(null, [
		1.438,-0.062,-0.062,0,0,
		-0.122,1.378,-0.122,0,0,
		-0.016,-0.016,1.483,0,0,
		0,0,0,1,0
	]),
	'koda': RGB_transform.bind(null, [
		1.12855,-0.39673,-0.03992,0,0.24991,
		-0.16404,1.08352,-0.05498,0,0.09698,
		-0.16786,-0.56034,1.60148,0,0.13972,
		0,0,0,1,0
	]),
	'technie': RGB_transform.bind(null, [
		1.91252,-0.85453,-0.09155,0,0.04624,
		-0.30878,1.76589,-0.10601,0,-0.27589,
		-0.23110,-0.75018,1.84759,0,0.12137,
		0,0,0,1,0
	]),
	'brownie': RGB_transform.bind(null, [
		0.59970,0.34553,-0.27082,0,0.186,
		-0.03770,0.86095,0.15059,0,-0.1449,
		0.24113,-0.07441,0.44972,0,-0.02965,
		0,0,0,1,0
	]),
	'invert': (data) => {
		for (var i = 0; i < data.length; i += 4) {
			data[i]     = 255 - data[i];
			data[i + 1] = 255 - data[i+1];
			data[i + 2] = 255 - data[i+2];
		}
	},
	/* Apple-like expose filter ( brightness + contrast [-50 ... 50] )
	    ---> https://stackoverflow.com/questions/10521978/html5-canvas-image-contrast#18495093
	*/
	'expose': (data, ajust) => {
		var factor = (259 * (ajust + 255)) / (255 * (259 - ajust));
		for (let i = 0; i < data.length; i += 4) {
			data[i]     = factor * (data[i]   + ajust - 128) + 128;
			data[i + 1] = factor * (data[i+1] + ajust - 128) + 128;
			data[i + 2] = factor * (data[i+2] + ajust - 128) + 128;
		}
	}
}

function RGB_transform(m, data) {
	for (var i = 0; i < data.length; i += 4) {
		let r = data[i], g = data[i + 1], b = data[i + 2];
		data[i]     = r * m[0]  + g * m[1]  + b * m[2]  + m[4]  * 255;
		data[i + 1] = r * m[5]  + g * m[6]  + b * m[7]  + m[9]  * 255;
		data[i + 2] = r * m[10] + g * m[11] + b * m[12] + m[14] * 255;
	}
}

function barChanger(e) {
	e.preventDefault();

	const { style } = this.firstElementChild;
	const { left, width } = this.getBoundingClientRect();

	let brightness = 0;

	const barMove = ({ clientX }) => {
		let pct = Math.round((clientX - left) / width * 100);
		if (pct > 100) {
			style.left = '100%';
			brightness = 50;
		} else if (pct < 0) {
			style.left = '0';
			brightness = -50;
		} else if (pct > 48 && pct < 52) {
			style.left = '50%';
			brightness = 0;
		} else {
			style.left = `${pct}%`;
			brightness = pct - 50;
		}
		applyFilters(brightness);
	};
	const barEnd = () => {
		Favn3kon.storeData({ brightness });
		style.backgroundColor = 'inherit';
		window.removeEventListener('mousemove', barMove, false);
		window.removeEventListener('mouseup', barEnd, false);
	}
	style.backgroundColor = 'green';
	barMove(e);
	
	window.addEventListener('mousemove', barMove, false);
	window.addEventListener('mouseup', barEnd, false);
}

const loadURL = (uri) => {
	try {
		const { host, protocol, href } = new URL(uri);
		if (protocol === 'data:' || host === location.host) {
			Favn3kon.pushKat(href);
		} else {
			Favn3kon.requ3st('image:3plz', href);
		}
		return true;
	} catch {
		return false;
	}
}

const imageLoad = (blob = null, src = '') => {

	if (blob)
		src = URL.createObjectURL(blob);

	image.onload = () => {
		const { width, height } = image;
		pasl.setZone(width, height);
		dropbx.replaceChild( pasl.box, ldstub );
		drawFavnekon(false);
		image.onload = image.onerror = null;
	}
	image.onerror = () => {
		ldstub.remove();
		image.alt = 'image source not found';
		image.onload = image.onerror = null;
	}
	image.src = src;
}

const imageReset = () => {
	const uri = image.src;
	pasl.box.remove();
	image.remove();
	image.removeAttribute('alt');
	image.src = '';
	if (uri && /^blob\:/.test(uri))
		URL.revokeObjectURL(uri);
}

function fileUpload(e) {
	e.preventDefault();
	var data = e.dataTransfer || e.target,
		file = data.files[0];
	if (file && /image\//.test(file.type)) {
		dropbx.prepend( ldstub, image );
		imageLoad(file);
	}
}

function drawFavnekon(upd_ico = false) {

	try {
		const scale = image.naturalWidth / image.width;
		const [X, Y, W, H] = pasl.getCoords(scale);
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, Q_HEIGHT, Q_HEIGHT);

		let step = Math.ceil(Math.log((H > W ? H : W) / Q_HEIGHT) / Math.log(2));
		if (step <= 1) {
			ctx.drawImage(image, X, Y, W, H, 0, 0, Q_HEIGHT, Q_HEIGHT);
		} else {
			let width  = W * 0.5,
				height = H * 0.5,
				oc     = _setup('canvas', { width, height }),
				octx   = oc.getContext('2d');
				
			octx.drawImage(image, X, Y, W, H, 0, 0, width, height);
			
			while ((step--) > 2) {
				width  *= 0.5;
				height *= 0.5;
				octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
			}
			ctx.drawImage(oc, 0, 0, width, height, 0, 0, Q_HEIGHT, Q_HEIGHT);
		}
		const imgData = ctx.getImageData(0, 0, Q_HEIGHT, Q_HEIGHT),
		      pixcnt  = imgData.data.length;

		let hash = 0, pixelData = new Array(pixcnt);

		for (let i = 0; i < pixcnt; i++) {
			hash += (pixelData[i] = imgData.data[i]) + i;
		}
		if ( Favn3kon.brightness || Favn3kon.colorAjusts.length ) {
			for (const name of Favn3kon.colorAjusts)
				ColorFilter[name](imgData.data);
			if (Boolean(Favn3kon.brightness))
				ColorFilter.expose(imgData.data, Favn3kon.brightness);
			ctx.putImageData(imgData, 0, 0);
		}
		Favn3kon.storeData({ hash, pixelData }, upd_ico);
	} catch (err) {
		console.error(err)
	}
}

function applyFilters(brightness = 0) {
	const ctx = canvas.getContext('2d'),
	   pixels = imgDataCpy(ctx, Favn3kon.pixelData);

	for (const name of Favn3kon.colorAjusts)
		ColorFilter[name](pixels.data);

	ColorFilter.expose(pixels.data, brightness);
	ctx.putImageData(pixels, 0, 0);
}

function imgDataCpy(contxt, pixelArray) {
	
	let imgData = contxt.getImageData(0, 0, Q_HEIGHT, Q_HEIGHT);
	
	for (let i = 0; i < pixelArray.length; i++)
		imgData.data[i] = pixelArray[i];
	
	return imgData;
}

function getLoadingIcon() {

	return `
	<svg class="svg-iload" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="200px" height="200px" viewBox="0 0 100 100">
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6">
	  <animate attributeName="opacity" begin="-0.9s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(30 50 50)">
	  <animate attributeName="opacity" begin="-0.8s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(60 50 50)">
	  <animate attributeName="opacity" begin="-0.75s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(90 50 50)">
	  <animate attributeName="opacity" begin="-0.6s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(120 50 50)">
	  <animate attributeName="opacity" begin="-0.6s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(150 50 50)">
	  <animate attributeName="opacity" begin="-0.5s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(180 50 50)">
	  <animate attributeName="opacity" begin="-0.4s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(210 50 50)">
	  <animate attributeName="opacity" begin="-0.3s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(240 50 50)">
	  <animate attributeName="opacity" begin="-0.25s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(270 50 50)">
	  <animate attributeName="opacity" begin="-0.15s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(300 50 50)">
	  <animate attributeName="opacity" begin="-0.1s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	<rect width="2" height="12" x="49" y="24" rx="1" ry="6" transform="rotate(330 50 50)">
	  <animate attributeName="opacity" begin="0s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
	</rect>
	</svg>`;
}
