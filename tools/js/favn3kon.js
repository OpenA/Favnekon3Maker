
const Q_HEIGHT = 32;

class Favn3kon {

	constructor() {
		this.hash  = 0,
		this.apply = false,

		this.i3koData = new Uint8Array(Q_HEIGHT*Q_HEIGHT*4),
		this.bright = 0,
		this.def_ico = '',
		this.alpha_color = '#f1f1f1',
		this.filters = new N3koFilter,
		this.n3kon3kt = null;
		this.all_urls_support = true;
		this.smooth_downscale = true;
		this.has_overlay = false;
		this.styles = [];
	}

	get i3ko() {

		const fvId = 'nk3__favIkon';
		const link = document.createElement('link');
		const favs = document.head.querySelectorAll([
			`link[rel$=icon]:not(#${fvId})`,
			'link[rel=manifest]',
			'meta[itemprop=image]'
		].join(','));

		let idef = '';

		for (const fav of favs) {
			let h = fav.href || fav.content;
			if (h && !idef)
				this.def_ico = idef = h;
			fav.remove();
		}
		Object.assign(link, { id: fvId, rel: 'icon', href: idef });
		Object.defineProperty(this, 'i3ko', { value: link });
		return link;
	}

	putn3kon(apply = false) {

		const { i3ko, canvas, def_ico } = this;

		i3ko.href = apply ? canvas.toDataURL() : def_ico;
		document.head.append(i3ko);
	}

	cpySourceData(src = this.i3koData) {
		const dst = this.context.createImageData(Q_HEIGHT, Q_HEIGHT);
		for(let i = 0; i < dst.data.length; i++)
			dst.data[i] = src[i];
		return dst;
	}

	bind3elem() {
		const { overlay, filters, apply, bright, def_ico } = this;
		const prefs = overlay.shadowRoot.getElementById('nk3__Prefs').children;
		for (const name of filters)
			 prefs[`nk3__${name}Filter`].classList.add('ch-x-k');
		if (apply) {
			prefs.nk3__Result.classList.add('ch-x-k');
			prefs.nk3__Default.classList.remove('ch-x-k');
		}
		prefs.nk3__Expose.children[0].style.left = `${ bright + 50 }%`;
		if (def_ico && !prefs.nk3__Default.src)
			prefs.nk3__Default.src = def_ico;
	}

	init3m({ apply, pixelData, brightness, colorAjusts, hash }) {
		const { filters, context, i3koData, has_overlay } = this;

		if (pixelData) {
			const pixels = context.createImageData(Q_HEIGHT, Q_HEIGHT);

			if (colorAjusts.length) {
				for (let i = 0; i < colorAjusts.length; i++) {
					const name = colorAjusts[i];
					if (name.startsWith('#')) {
						this.alpha_color = name;
					} else {
						filters.push(name);
					}
				}
			}
			for (let i = 0; i  < i3koData.length; i++) {
				pixels.data[i] = i3koData[i] = pixelData[i];
			}
			if (brightness !== 0) {
				let pct = (this.bright = brightness & 0x7F);
				expose.firstElementChild.style.left = `${ pct + 50 }%`;
			}
			this.hash = hash, this.apply = apply;
			context.putImageData(pixels, 0,0);
			if (has_overlay)
				this.bind3elem();
		}
		this.putn3kon(apply);
	}

	requ3st(req = '', data = null) {
		/* connect to the service worker */
	}

	storeData(changes = {}, upd_ico = false) {
		let { apply, hash, i3koData, bright, filters } = this;
		
		if('apply' in changes)
			apply = this.apply = changes.apply;
		if('bright' in changes)
			bright = this.bright = changes.bright;
		if('hash' in changes)
			hash = this.hash = changes.hash;
		this.putn3kon(apply);
		this.requ3st(`${upd_ico ? 'upd' : 'save'}:3plz`, {
			apply, pixelData: [].concat(i3koData), brightness: bright,
			hash, colorAjusts: [].concat(filters)
		});
	}
/** local handler
 * @param {UIEvent} e
 */
	handleEvent(e) {
		e.stopPropagation();

		let el = e.target, f = false;

		switch (el.classList[0]) {
		case 'nk3-ico':
			if (!el.classList.contains('ch-x-k')) {
				f = el.parentNode.children.nk3__Result.classList.toggle('ch-x-k');
				/**/el.parentNode.children.nk3__Default.classList.toggle('ch-x-k');
				this.storeData({ apply: f });
			}
			break;
		case 'nk3-filter':
			f = el.classList.toggle('ch-x-k');
			this.toggleFilter(el.getAttribute('itemprop'), f);
			this.storeData();
			break;
		case 'nk3-close-btn':
			this.overlay.remove();
			break;
		case 'nk3-ex-slider': el = el.parentNode;
		case 'nk3-ex-bar':
			e.preventDefault();
			if (e.type !== 'click')
				this.barChange(el, e.clientX);
			break;
		}
	}
	toggleFilter(name, do_add = false) {
		const { bright, context, filters } = this;
		const pixels = this.cpySourceData();
		if (do_add)
			filters.push(name);
		else
			filters.splice(filters.indexOf(name),1);
		filters.applyFilters(pixels.data, bright);
		context.putImageData(pixels, 0, 0);
	}

	get pasl() {
		const pasl = new PasL({ lock: 0x3, edgies: false });
		Object.defineProperty(this, 'pasl', { enumerable: true, value: pasl });
		return pasl;
	}
	get image() {
		const img = new Image; img.id = 'nk3__wkImage';
		Object.defineProperty(this, 'image', { enumerable: true, value: img });
		return img;
	}
	get canvas() {
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = Q_HEIGHT;
		Object.defineProperty(this, 'canvas', { enumerable: true, value: canvas });
		return canvas;
	}
	get context() {
		const context = this.canvas.getContext('2d');
		Object.defineProperty(this, 'context', { enumerable: true, value: context });
		return context;
	}
	get overlay() {
		const { canvas:canvs, styles } = this;
		const onUpload = e => {
			/**/e.preventDefault();
			if (e.type === 'dragover')
				return;
			let file = (e.dataTransfer || e.target).files[0];
			if (file && file.type.startsWith('image/'))
				this.reloadImage(file);
		},
		mCard  = _setup('div', { id: 'nk3__magCard' }, { click: this }),
		dropx  = _setup('div', { id: 'nk3__DropBox', class: 'nk3-itab' }, { drop: onUpload, dragover: onUpload }),
		prefs  = _setup('div', { id: 'nk3__Prefs'  , class: 'nk3-itab' }),
		expBar = _setup('div', { id: 'nk3__Expose' , class: 'nk3-ex-bar' }, { mousedown: this }),
		cmdInp = _setup('div', { id: 'nk3__Input' }),

		overly = _setup('div', { class: 'nk3-s-overlay', style: 'height: 0; width: 100%; left: 0; top: 0; position: fixed; z-index: 999999;' }),
		slider = _setup('div', { class: 'nk3-ex-slider', style: 'background-color: inherit; left: 50%;' }),
		clsbtn = _setup('div', { class: 'nk3-close-btn' }),
		
		shadow = overly.attachShadow({ mode: 'open' });

		mCard.addEventListener(PasL_onEnd, () => this.drawn3kon(true));
		mCard.append(cmdInp, prefs, dropx, clsbtn);
		dropx.appendChild(
			_setup('label', { id: 'nk3__dropArrow' })).append(
			_setup('input', { type: 'file', style: 'display: none;' }, { change: onUpload }));
		prefs.append(
			_setup(canvs, { id: 'nk3__Result' , class: 'nk3-ico' }),
			_setup('img', { id: 'nk3__Default', class: 'nk3-ico ch-x-k', width: Q_HEIGHT, height: Q_HEIGHT }),

			_setup('div', { id: 'nk3__grayFilter'   , class: 'nk3-filter', itemprop: 'gray'   }),
			_setup('div', { id: 'nk3__sepiaFilter'  , class: 'nk3-filter', itemprop: 'sepia'  }),
			_setup('div', { id: 'nk3__invertFilter' , class: 'nk3-filter', itemprop: 'invert' }),
			_setup('div', { id: 'nk3__kodaFilter'   , class: 'nk3-filter', itemprop: 'koda'   }),
			_setup('div', { id: 'nk3__polarFilter'  , class: 'nk3-filter', itemprop: 'polar'  }),
			_setup('div', { id: 'nk3__technieFilter', class: 'nk3-filter', itemprop: 'technie'}),
			_setup('div', { id: 'nk3__brownieFilter', class: 'nk3-filter', itemprop: 'brownie'}),
		expBar);
		expBar.append( slider );
		shadow.append( mCard );

		for (const css of styles) {
			const lnk = shadow.appendChild(document.createElement('link'));
			lnk.href = css, lnk.rel = 'stylesheet';
		}
		SuwakoInput.define(cmdInp, { on_apply_emiter: true, variants: ['clear'] });
		SuwakoInput.attach(cmdInp, cmd => {
			var url = '', rel = false;
			if (cmd === 'clear') {
				url = '', rel = true;
			} else if (cmd) try {
				const { protocol, host, href } = new URL(cmd);
				rel = protocol === 'data:' || host === location.host || this.all_urls_support;
				url = href;
			} catch {
				url = '', rel = false;
			}
			if (url && !rel) {
				cmdInp.classList.remove('nk3-invalid');
				this.requ3st('image:3plz', url);
			} else if (rel) {
				cmdInp.classList.remove('nk3-invalid');
				this.reloadImage(null, url);
			} else
				cmdInp.classList.add('nk3-invalid');
		});
		Object.defineProperty(this, 'overlay', { value: overly });
		this.has_overlay = true;
		return overly;
	}
	reloadImage(blob = null, url = '') {
		const { image, overlay } = this;
		const hasSrc = !!blob || !!url;
		const dropbx = overlay.shadowRoot.getElementById('nk3__DropBox');
		const expUri = image.src;
		const onLoad = ({ type }) => {
			dropbx.classList.remove('nk3-iload');
			if (type === 'error') {
				dropbx.classList.add('nk3-ierror');
			} else {
				dropbx.prepend( this.pasl.box, image );
				this.pasl.setZone(image);
				this.drawn3kon();
			}
			image.onload = image.onerror = null;
		}
		if (hasSrc)
			image.onload = image.onerror = onLoad,
			dropbx.classList.add('nk3-iload');
		dropbx.classList.remove('nk3-ierror');
		if (expUri) {
			this.pasl.box.remove();
			image.src = '', image.remove();
			if (/^blob\:/.test(expUri))
			URL.revokeObjectURL(expUri);
		}
		if (blob) {
			image.src = URL.createObjectURL(blob);
		} else if(url) {
			fetch(url).then(res => {
				!res.ok ? onLoad({ type: 'error' }) : res.blob().then(b => {
					image.src = URL.createObjectURL(b);
				})
			});
		}
	}
	barChange(bar, startX) {
		const { left, width } = bar.getBoundingClientRect();
		const { style } = bar.firstElementChild;
		const { context, filters } = this;
		const source = this.cpySourceData();

		let brightness = 0; style.backgroundColor = 'green';
	
		const barMove = (movX) => {
			let pct = Math.round((movX - left) / width * 100);
			if (pct >= 100) {
				style.left = '100%';
				brightness = 50;
			} else if (pct <= 0) {
				style.left = '0%';
				brightness = -50;
			} else if (pct > 48 && pct < 52) {
				style.left = '50%';
				brightness = 0;
			} else {
				style.left = `${pct}%`;
				brightness = pct - 50;
			};
			const pixels = this.cpySourceData(source.data);
			filters.expose(pixels.data, brightness);
			context.putImageData(pixels, 0,0)
		};
		filters.applyFilters(source.data, 0);
		barMove(startX);

		MUIDragable.addListener(bar, barMove, false).then(() => {
			this.storeData({ bright: brightness });
			style.backgroundColor = 'inherit';
		});
	}

	drawn3kon(upd_ico = false) {
		const { image, canvas, pasl, _oc = document.createElement('canvas') } = this;
		const [ iX,iY, iW,iH ] = pasl.getCoords(image.naturalWidth / image.width);
		
		let hash = 0, iDat,
			step = this.smooth_downscale && Math.ceil(
				Math.log((iH > iW ? iH : iW) / Q_HEIGHT) / Math.log(2));
		try {
			const octx = canvas.getContext('2d', { willReadFrequently: true });
			octx.clearRect(0,0, Q_HEIGHT, Q_HEIGHT);

			if (step <= 1) {
				octx.drawImage(image, iX,iY, iW,iH, 0,0, Q_HEIGHT, Q_HEIGHT);
			} else {
				let ow  = _oc.width  = iW *.5,
					oh  = _oc.height = iH *.5,
					ctx = _oc.getContext('2d');

				ctx.fillStyle = '#f1f1f1';
				ctx.rect(0,0, ow,oh);
				ctx.fill();

				ctx.drawImage(image, iX,iY, iW,iH, 0,0, ow,oh);
				for (; step > 2; step--, ow *=.5, oh *=.5)
				ctx.drawImage(_oc, 0, 0, iW *.25, iH *.25);

				octx.drawImage(_oc, 0,0, ow,oh, 0,0, Q_HEIGHT, Q_HEIGHT);
			}
			iDat = octx.getImageData(0,0, Q_HEIGHT, Q_HEIGHT);

			for (let i = 0; i < iDat.data.length; i++)
				hash += (this.i3koData[i] = iDat.data[i]) + i;
			if (this.bright || this.filters.length) {
				this.filters.applyFilters(iDat.data, this.bright);
				octx.putImageData(iDat, 0, 0);
			}
			this._oc = _oc;
			this.storeData({ hash }, upd_ico);
		} catch (err) {
			console.error(err);
		}
	}
};

class N3koFilter extends Array {

	constructor() {
		super();
	}
	applyFilters(data, bright = 0) {
		for (const ajust of this)
			this[ajust](data);
		if (bright)
			this.expose(data, bright);
	}
	// from Fabric.js Image Filters ( original source code http://fabricjs.com/image-filters )
	transformColor(data, m) {
		for (var i = 0; i < data.length; i += 4) {
			let r = data[i], g = data[i + 1], b = data[i + 2];
			data[i + 0] = r * m[ 0] + g * m[ 1] + b * m[ 2] + m[ 4] * 255;
			data[i + 1] = r * m[ 5] + g * m[ 6] + b * m[ 7] + m[ 9] * 255;
			data[i + 2] = r * m[10] + g * m[11] + b * m[12] + m[14] * 255;
		}
	}
	gray(data) {
		for (let i = 0; i < data.length; i += 4) {
			data[i + 2] = data[i+1] = data[i] = (0.21 * data[i] + 0.72 * data[i+1] + 0.07 * data[i+2]);
		}
	}
	sepia(data) {
		this.transformColor(data, [
			0.393, 0.769, 0.189, 0, 0,
			0.349, 0.686, 0.168, 0, 0,
			0.272, 0.534, 0.131, 0, 0,
			0, 0, 0, 1, 0
		]);
	}
	polar(data) {
		this.transformColor(data, [
			1.438,-0.062,-0.062,0,0,
			-0.122,1.378,-0.122,0,0,
			-0.016,-0.016,1.483,0,0,
			0,0,0,1,0
		]);
	}
	koda(data) {
		this.transformColor(data, [
			1.12855,-0.39673,-0.03992,0,0.24991,
			-0.16404,1.08352,-0.05498,0,0.09698,
			-0.16786,-0.56034,1.60148,0,0.13972,
			0,0,0,1,0
		]);
	}
	technie(data) {
		this.transformColor(data, [
			1.91252,-0.85453,-0.09155,0,0.04624,
			-0.30878,1.76589,-0.10601,0,-0.27589,
			-0.23110,-0.75018,1.84759,0,0.12137,
			0,0,0,1,0
		]);
	}
	brownie(data) {
		this.transformColor(data, [
			0.59970,0.34553,-0.27082,0,0.186,
			-0.03770,0.86095,0.15059,0,-0.1449,
			0.24113,-0.07441,0.44972,0,-0.02965,
			0,0,0,1,0
		]);
	}
	invert(data) {
		for (var i = 0; i < data.length; i += 4) {
			data[i + 0] = 255 - data[i+0];
			data[i + 1] = 255 - data[i+1];
			data[i + 2] = 255 - data[i+2];
		}
	}
	/* Apple-like expose filter ( brightness + contrast [-50 ... 50] )
		---> https://stackoverflow.com/questions/10521978/html5-canvas-image-contrast#18495093
	*/
	expose(data, ajust) {
		var factor = (259 * (ajust + 255)) / (255 * (259 - ajust));
		for (let i = 0; i < data.length; i += 4) {
			data[i + 0] = factor * (data[i+0] + ajust - 128) + 128;
			data[i + 1] = factor * (data[i+1] + ajust - 128) + 128;
			data[i + 2] = factor * (data[i+2] + ajust - 128) + 128;
		}
	}
};
