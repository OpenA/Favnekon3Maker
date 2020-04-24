
const Q_HEIGHT = 32;

const Favn3kon = {
	
	id   : 'n3kon3kt',
	apply: false,
	
	pixelData  : [],
	brightness : -0,
	colorAjusts: [],
	
	pushKat: function(src) {
		imageReset();
		if (src) {
			if (/^data\:image\/[^\s]+/.test(src)) {
				fetch(src).then(res => res.blob()).then(blob => {
					image.src = URL.createObjectURL(blob);
				});
			} else
				image.src = src;
			drop.prepend( pasL.box, image );
			canvas.style = '';
		}
		document.body.appendChild(overlay);
	},
	initMe: function({ apply, pixelData, brightness, colorAjusts }) {
		if (pixelData) {
			const contxt = canvas.getContext('2d'),
			      pixels = imgDataCpy(contxt, pixelData);
			
			if (Boolean(brightness)) {
				overlay.querySelector('.brithnes > .block').style.left = `${ (this.brightness = brightness) + 50 }%`;
				ColorFilter.expose(pixels.data, brightness);
			}
			if (Boolean(colorAjusts.length)) {
				const filters = overlay.querySelectorAll(`[itemprop="${ colorAjusts.join('"],[itemprop="') }"]`);
				for (let i = 0; i < colorAjusts.length; i++) {
					ColorFilter[ (this.colorAjusts[i] = colorAjusts[i]) ](pixels.data);
					filters[i].classList.add('ch-x-k');
				}
			}

			Object.assign(this.pixelData, pixelData);
			contxt.putImageData(pixels, 0, 0);
			
			if (apply) {
				link.href  = canvas.toDataURL();
				this.apply = canvas.classList.toggle('ch-x-k');
				deffav.classList.remove('ch-x-k');
			}
		}
		document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', onReady) : onReady();
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
				this.apply = canvas.classList.toggle('ch-x-k');
				target.classList.add('ch-x-k');
				link.href = target.src;
				stFavnekonData();
				break;
			case 'nk3__previewIcon': /* target = canvas */
				this.apply = target.classList.toggle('ch-x-k');
				deffav.classList.remove('ch-x-k');
				stFavnekonData();
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
				stFavnekonData();
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
      drop   = _setup(overlay.querySelector('droparea'), null, { dragover: e => { e.preventDefault() }, drop: fileUpload });

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
chrome.runtime.sendMessage({ name: Favn3kon.id });

const pasL = (() => {
	
	const box = _setup('div', { id: 'pasL_box', style: 'position: absolute;' }),
	   shift  = { ptp: '', sX: 0, sY: 0, eX: 0, eY: 0 },
	   coords = { x1: 0, y1: 0, w: 0, h: 0, x2: 0, y2: 0 },
	   events = { mousemove: areaMovement, mouseup: () => { _setup(window, null, { remove: events }); drawImage(); }},
	   behind = {
		top   : _setup('div', { id: 'pasl_behind_top'   , class: 'pasl-row-sect pasl-dark' }),
		right : _setup('div', { id: 'pasl_behind_right' , class: 'pasl-col-sect pasl-dark' }),
		left  : _setup('div', { id: 'pasl_behind_left'  , class: 'pasl-col-sect pasl-dark' }),
		bottom: _setup('div', { id: 'pasl_behind_bottom', class: 'pasl-row-sect pasl-dark' }),
		select: _setup('div', { id: 'pasl_behind_select', class: 'pasl-selection-area' }),
		center: _setup('div', { /* pasl_behind_center */  class: 'pasl-col-sect' })
	};
	
	box.append(
		behind['left'],
		behind['center'],
		behind['right']
	);
	behind['center'].append(
		behind['top'],
		behind['select'],
		behind['bottom']
	);
	
	behind['select'].insertAdjacentHTML('afterbegin', (
		'<div class="pasl-rcons" id="rcon_t-l"></div>'+
		'<div class="pasl-rcons" id="rcon_t-r"></div>'+
		'<div class="pasl-rcons" id="rcon_b-l"></div>'+
		'<div class="pasl-rcons" id="rcon_b-r"></div>'));
	
	behind['select'].addEventListener('mousedown', (e) => {
		e.preventDefault();
		shift.sX = e.clientX;
		shift.sY = e.clientY;
		if (e.target.classList[0] === 'pasl-rcons') {
			shift.ptp = e.target.id.split('_')[1];
			shift.eX = coords.w;
			shift.eY = coords.h;
		} else {
			shift.ptp = 'm-v';
			shift.eX = coords.x1;
			shift.eY = coords.y1;
		}
		_setup(window, null, events);
	});
	
	const SelectArea = {
		get 'x' ( ) { return coords.x1 },
		set 'x' (n) {
				coords.x1 = n > 0 ? n : 0;
				if (coords.x1 + coords.w > coords.size[0]) {
					coords.x1 = coords.size[0] - coords.w;
				}
				coords.x2 = coords.size[0] - coords.x1 - coords.w;
				behind.left.style['width'] = coords.x1 +'px';
				behind.right.style['width'] = coords.x2 +'px';
			},
		get 'y' ( ) { return coords.y1 },
		set 'y' (n) {
				coords.y1 = n > 0 ? n : 0;
				if (coords.y1 + coords.h > coords.size[1]) {
					coords.y1 = coords.size[1] - coords.h;
				}
				coords.y2 = coords.size[1] - coords.y1 - coords.h;
				behind.top.style['height'] = coords.y1 +'px';
				behind.bottom.style['height'] = coords.y2 +'px';
			},
		get 'w' ( ) { return coords.w },
		set 'w' (n) {
				behind.select.style['width'] = (coords.w  = coords.size[0] > n + coords.x1 ? (n > 0 ? n : 0) : coords.size[0] - coords.x1) +'px';
				behind.right.style['width']  = (coords.x2 = coords.size[0] - coords.x1 - coords.w) +'px';
			},
		get 'h' ( ) { return coords.h },
		set 'h' (n) {
				coords.h  = coords.size[1] > n + coords.y1 ? (n > 0 ? n : 0) : coords.size[1] - coords.y1;
				coords.y2 = coords.size[1] - coords.y1 - coords.h;
				behind.select.style['height'] = coords.h  +'px';
				behind.bottom.style['height'] = coords.y2 +'px';
			},
		get 'rw'( ) { return coords.w },
		set 'rw'(n) {
				coords.w  = coords.size[0] > n + coords.x2 ? (n > 0 ? n : 0) : coords.size[0] - coords.x2;
				coords.x1 = coords.size[0] - coords.x2 - coords.w;
				behind.select.style['width'] = coords.w +'px';
				behind.left.style['width']  = coords.x1 +'px';
			},
		get 'rh'( ) { return coords.h },
		set 'rh'(n) {
				coords.h  = coords.size[1] > n + coords.y2 ? (n > 0 ? n : 0) : coords.size[1] - coords.y2;
				coords.y1 = coords.size[1] - coords.y2 - coords.h;
				behind.select.style['height'] = coords.h +'px';
				behind.top.style['height']   = coords.y1 +'px';
			}
	}
	
	function areaMovement(e) {
		var rx, x = e.clientX - shift.sX + shift.eX,
			ry, y = e.clientY - shift.sY + shift.eY;
		switch (shift.ptp) {
			case 'm-v':
				SelectArea.x = x;
				SelectArea.y = y;
				break;
			case 't-l':
				rx = shift.sX - e.clientX + shift.eX;
				ry = shift.sY - e.clientY + shift.eY;
				SelectArea.rw = SelectArea.lock && ry > rx ? ry : rx;
				SelectArea.rh = SelectArea.lock && rx > ry ? rx : ry;
				break;
			case 't-r':
				ry = shift.sY - e.clientY + shift.eY;
				SelectArea.w  = SelectArea.lock && ry > x ? ry : x;
				SelectArea.rh = SelectArea.lock && x > ry ? x : ry;
				break;
			case 'b-l':
				rx = shift.sX - e.clientX + shift.eX;
				SelectArea.rw = SelectArea.lock && y > rx ? y : rx;
				SelectArea.h  = SelectArea.lock && rx > y ? rx : y;
				break;
			case 'b-r':
				SelectArea.w = SelectArea.lock && y > x ? y : x;
				SelectArea.h = SelectArea.lock && x > y ? x : y;
		}
		e.preventDefault();
	}
	function areaSelect(img, points) {
		box.style['width' ] = img.width  +'px';
		box.style['height'] = img.height +'px';
		coords.size  = [img.width, img.height];
		coords.ratio = [img.naturalWidth / img.width, img.naturalHeight / img.height];
		coords.x1 = points.x || 0;
		coords.y1 = points.y || 0;
		coords.w  = points.w || Q_HEIGHT;
		coords.h  = points.h || Q_HEIGHT;
		for (var vec in points) {
			SelectArea[vec] = points[vec];
		}
		drawImage();
	}
	function drawImage() {
		drawFavnekon(
			Math.floor(coords.x1 * coords.ratio[0]),
			Math.floor(coords.y1 * coords.ratio[1]),
			Math.floor(coords.w  * coords.ratio[0]),
			Math.floor(coords.h  * coords.ratio[1])
		);
	}
	return {
		box: box,
		draw: drawImage,
		select: areaSelect
	}
})();

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

function onReady() {
	
	document.removeEventListener('DOMContentLoaded', onReady);
	
	const head = document.getElementsByTagName('head')[0];
	var favico = head.querySelectorAll('link[rel$="icon"], link[rel="icon"]');
	
	if (favico.length) {
		
		deffav.src = Favn3kon.apply ? favico[0].href : (link.href = favico[0].href);
		
		for (var i = 0; i < favico.length; i++) {
			head.removeChild(favico[i]);
		}
	} else if ((favico = head.querySelector('meta[itemprop="image"]'))) {
		
		deffav.src = Favn3kon.apply ? favico.content : (link.href = favico.content);
	}
	head.appendChild(link);
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
		stFavnekonData();
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
	
	var eObj = {
		lock: true,
		x: 0, w: this.width,
		y: 0, h: this.height
	}
	
	if (this.width > this.height) {
		eObj.w = this.height;
		eObj.x = (this.width - this.height) / 2;
	} else
		if (this.width < this.height) {
			eObj.h = this.width;
			eObj.y = (this.height - this.width) / 2;
		}
	
	pasL.select(this, eObj);
}

function imageReset() {
	image.remove();
	pasL.box.remove();
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

function drawFavnekon(X, Y, W, H) {

	try {
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
		let changes = false;
		
		Object.assign(Favn3kon.pixelData, imgData.data);
		
		if ((changes = Boolean(Favn3kon.brightness)))
			ColorFilter.expose(imgData.data, Favn3kon.brightness);

		for (const name of Favn3kon.colorAjusts) {
			ColorFilter[name](imgData.data);
			changes = true;
		}
		if ( changes ) {
			ctx.putImageData(imgData, 0, 0);
		}
		stFavnekonData();
	} catch (err) {
		console.info(err)
	}
}

function applyFilters() {
	const ctx = canvas.getContext('2d'),
	   pixels = imgDataCpy(ctx, Favn3kon.pixelData);

	ColorFilter.expose(pixels.data, Favn3kon.brightness);

	for (const name of Favn3kon.colorAjusts)
		ColorFilter[name](pixels.data);

	ctx.putImageData(pixels, 0, 0);
}

function stFavnekonData() {
	const { apply, pixelData, brightness, colorAjusts } = Favn3kon;
	
	if (apply)
		link.href = canvas.toDataURL();
	
	chrome.runtime.sendMessage({
		name: 'save:3plz',
		data: {
			pixelData, apply, brightness, colorAjusts
		}
	});
}

function imgDataCpy(contxt, pixelArray) {
	
	let imgData = contxt.getImageData(0, 0, Q_HEIGHT, Q_HEIGHT);
	
	for (let i = 0; i < pixelArray.length; i++)
		imgData.data[i] = pixelArray[i];
	
	return imgData;
}

function _setup(el, _Attrs, _Events) {
	if (el) {
		if (typeof el === 'string') {
			el = document.createElement(el);
		}
		if (_Attrs) {
			for (var key in _Attrs) {
				_Attrs[key] === undefined ? el.removeAttribute(key) :
				key === 'html' ? el.innerHTML   = _Attrs[key] :
				key === 'text' ? el.textContent = _Attrs[key] :
				key in el    && (el[key]        = _Attrs[key] ) == _Attrs[key]
				             &&  el[key]       == _Attrs[key] || el.setAttribute(key, _Attrs[key]);
			}
		}
		if (_Events) {
			if ('remove' in _Events) {
				for (var type in _Events['remove']) {
					if (_Events['remove'][type].forEach) {
						_Events['remove'][type].forEach(function(fn) {
							el.removeEventListener(type, fn, false);
						});
					} else {
						el.removeEventListener(type, _Events['remove'][type], false);
					}
				}
				delete _Events['remove'];
			}
			for (var type in _Events) {
				el.addEventListener(type, _Events[type], false);
			}
		}
	}
	return el;
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
