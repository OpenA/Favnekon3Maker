
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
			fetch(src).then(res => res.blob()).then(blob => {
				image.src = URL.createObjectURL(blob);
			});
			drop.prepend( sarea.box, image );
			canvas.style = '';
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

	initMe: function({ apply, pixelData, brightness, colorAjusts, hash }) {
		if (pixelData) {
			const contxt = canvas.getContext('2d'),
				  pixels = imgDataCpy(contxt, pixelData);

			if (Boolean(colorAjusts.length)) {
				const filters = overlay.querySelectorAll(`[itemprop="${ colorAjusts.join('"],[itemprop="') }"]`);
				for (let i = 0; i < colorAjusts.length; i++) {
					ColorFilter[ (this.colorAjusts[i] = colorAjusts[i]) ](pixels.data);
					filters[i].classList.add('ch-x-k');
				}
			}
			if (Boolean(brightness)) {
				overlay.querySelector('.brithnes > .block').style.left = `${ (this.brightness = brightness) + 50 }%`;
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
	handleEvent: function({ target }) {
		switch (target.id) {
			case 'nk3__overlayCloseBtn':
				overlay.remove();
				break;
			case 'nk3__dropDownArrow':
				target.firstElementChild.click();
				break;
			case 'nk3__faviconDefault': /* target = deffav */
				this.apply = false;
				canvas.classList.remove('ch-x-k');
				target.classList.add('ch-x-k');
				link.href = target.src;
				storeData();
				break;
			case 'nk3__previewIcon': /* target = canvas */
				this.apply = true;
				target.classList.add('ch-x-k');
				deffav.classList.remove('ch-x-k');
				link.href = target.toDataURL();
				storeData();
				break;
			case 'nk3__addFilter':
				let name = target.getAttribute('itemprop');
				if (target.classList.toggle('ch-x-k')) {
					this.colorAjusts.push(name);
				} else {
					this.colorAjusts.splice(
						this.colorAjusts.indexOf(name), 1);
				}
				applyFilters();
				storeData();
		}
	}
};

const link    = _setup('link', { id: 'favn__3kon', rel: 'icon' });
const image   = _setup('img' , { id: 'nk3__workaroundImage' }, { error: imageReset, load: imageLoad });
const overlay = _setup('div' , { id: 'nk3__shadowBoxOverlay', html: `
	<div id="nk3__magnethingCard">
		<input id="nk3__addURLInput" type="text" placeholder="Image URL">
		<label id="nk3__overlayCloseBtn"></label>
		<citab>
			<canvas id="nk3__previewIcon" width="${Q_HEIGHT}" height="${Q_HEIGHT}" class="pre-fav"></canvas>
			<img id="nk3__faviconDefault" width="${Q_HEIGHT}" height="${Q_HEIGHT}" class="pre-fav ch-x-k">
			<div id="nk3__addFilter" class="fill-fav" itemprop="gray"></div>
			<div id="nk3__addFilter" class="fill-fav" itemprop="sepia"></div>
			<div id="nk3__addFilter" class="fill-fav" itemprop="invert"></div>
			<div id="nk3__addFilter" class="fill-fav" itemprop="koda"></div>
			<div id="nk3__addFilter" class="fill-fav" itemprop="polar"></div>
			<div id="nk3__addFilter" class="fill-fav" itemprop="technie"></div>
			<div id="nk3__addFilter" class="fill-fav" itemprop="brownie"></div>
			<div class="brithnes">
				<div class="block" style="background-color: inherit; left: 50%;"></div>
			</div>
		</citab>
		<droparea>
			<div id="nk3__dropDownArrow"><input type="file" style="display: none!important;"></div>
		</droparea>
	</div>`
}, { 
	click: Favn3kon
});

const canvas = overlay.querySelector('#nk3__previewIcon'),
      deffav = overlay.querySelector('#nk3__faviconDefault'),
      sarea  = new PasL({ lock: true, edgies: false }),
      drop   = _setup(overlay.querySelector('droparea'), null, { dragover: e => { e.preventDefault() }, drop: fileUpload });

sarea.addListener('MoveEnd', drawFavnekon);
drop.children['nk3__dropDownArrow'].addEventListener('change', fileUpload);
overlay.querySelector('.brithnes').addEventListener('mousedown', barChanger);
overlay
	.querySelector('#nk3__addURLInput')
	.addEventListener('input', ({ target }) => {
		try {
			const { host, protocol, href } = new URL(target.value);
			if (protocol == 'data:' || host === location.host) {
				Favn3kon.pushKat(href);
				target.value = '';
			} else {
				chrome.runtime.sendMessage({ name: 'image:3plz', data: href });
			}
			target.style.color = null;
		} catch {
			target.style.color = 'red';
		}
	});

chrome.runtime.onMessage.addListener(({ action, data }) => { Favn3kon[action](data) });
chrome.runtime.sendMessage({ name: 'n3kon3kt' });

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

	const barMove = ({ clientX }) => {
		let pct = Math.round((clientX - left) / width * 100);
		if (pct > 100) {
			style.left = '100%';
			Favn3kon.brightness = 50;
		} else if (pct < 0) {
			style.left = '0';
			Favn3kon.brightness = -50;
		} else if (pct > 48 && pct < 51) {
			style.left = '50%';
			Favn3kon.brightness = 0;
		} else {
			style.left = `${pct}%`;
			Favn3kon.brightness = pct - 50;
		}
		applyFilters();
	};
	
	const barEnd = () => {
		storeData();
		style['background-color'] = 'inherit';
		window.removeEventListener('mousemove', barMove, false);
		window.removeEventListener('mouseup', barEnd, false);
	}
	style['background-color'] = 'green';
	barMove(e);
	
	window.addEventListener('mousemove', barMove, false);
	window.addEventListener('mouseup', barEnd, false);
}

function imageLoad(e) {

	let start_x = 0, sel_w = e.target.width;
	let start_y = 0, sel_h = e.target.height;

	if (sel_w > sel_h) {
		start_x = (e.target.width - e.target.height) / 2;
		  sel_w =  e.target.height;
	} else if (sel_w < sel_h) {
		start_y = (e.target.height - e.target.width) / 2;
		  sel_h =  e.target.width;
	}
	sarea.selectZone(e.target, start_x, start_y, sel_w, sel_h);
	drawFavnekon(false);
}

function imageReset() {
	image.remove();
	sarea.box.remove();
	if (/^blob\:/.test(image.src))
		URL.revokeObjectURL(image.src);
}

function fileUpload(e) {
	e.preventDefault();
	var data = e.dataTransfer || e.target,
		file = data.files[0];
	if (file && /image\//.test(file.type)) {
		Favn3kon.pushKat( URL.createObjectURL(file) );
	}
}

function drawFavnekon(update = true) {

	try {
		const [X, Y, W, H] = sarea.getCoords();
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
		const imgData = ctx.getImageData(0, 0, Q_HEIGHT, Q_HEIGHT);
		let hash = 0, changes = Favn3kon.brightness | Favn3kon.colorAjusts.length;

		for (let i = 0; i < imgData.data.length; i++) {
			hash += (Favn3kon.pixelData[i] = imgData.data[i]) + i;
		}
		if ( changes ) {
			for (const name of Favn3kon.colorAjusts)
				ColorFilter[name](imgData.data);
			if (Boolean(Favn3kon.brightness))
				ColorFilter.expose(imgData.data, Favn3kon.brightness);
			ctx.putImageData(imgData, 0, 0);
		}
		Favn3kon.hash = hash;
		storeData(update);
	} catch (err) {
		console.info(err)
	}
}

function applyFilters() {
	const ctx = canvas.getContext('2d'),
	   pixels = imgDataCpy(ctx, Favn3kon.pixelData);

	for (const name of Favn3kon.colorAjusts)
		ColorFilter[name](pixels.data);

	ColorFilter.expose(pixels.data, Favn3kon.brightness);
	ctx.putImageData(pixels, 0, 0);
}

function storeData(update = false) {
	const { apply, hash, pixelData, brightness, colorAjusts } = Favn3kon;
	
	if (apply)
		link.href = canvas.toDataURL();
	
	chrome.runtime.sendMessage({
		name: (update ? 'upd:3plz' : 'save:3plz'),
		data: {
			apply, hash, pixelData, brightness, colorAjusts
		}
	});
}

function imgDataCpy(contxt, pixelArray) {
	
	let imgData = contxt.getImageData(0, 0, Q_HEIGHT, Q_HEIGHT);
	
	for (let i = 0; i < pixelArray.length; i++)
		imgData.data[i] = pixelArray[i];
	
	return imgData;
}

if (!('width' in DOMRect.prototype)){
	Object.defineProperty(DOMRect.prototype, 'width', {
		configurable: true,
		enumerable: true,
		get: function width() {
			const value = this.right - this.left;
			Object.defineProperty(this, 'width', { value });
			return value;
		}
	});
}
