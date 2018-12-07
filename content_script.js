
const Favnekon = {
	id     : 'n3kon3kt',
	apply  : sessionStorage['Favnekon'],
	pushKat: function(src) {
		if (!src) {
			imageReset();
		} else {
			this.drop.prepend( pasL.box, this.image );
			this.image.src = src;
			this.canvas.style = '';
		}
		document.body.appendChild(Favnekon.overlay);
	},
	handleEvent: function({ target }) {
		switch (target.id) {
			case 'nk3__overlayCloseBtn':
				this.overlay.remove();
				break;
			case 'nk3__dropDownArrow':
				target.firstElementChild.click();
				break;
			case 'nk3__faviconDefault':
				this.apply = this.canvas.classList.toggle('ch-x-k');
				this.def.classList.add('ch-x-k');
				sessionStorage.removeItem('Favnekon');
				this.link.href = this.def.src;
				break;
			case 'nk3__previewIcon':
				this.apply = target.classList.toggle('ch-x-k');
				this.def.classList.remove('ch-x-k');
				sessionStorage.setItem('Favnekon', (
					this.link.href = target.toDataURL()
				));
				break;
			case 'nk3__addFilter':
				const name = target.getAttribute('itemprop');
				if (target.classList.toggle('ch-x-k')) {
					Filter.applied.push(name);
					if (!this.apply)
						return;
					const imageData = contxt.getImageData(0, 0, 16, 16);
					Filter[name](imageData.data);
					contxt.putImageData(imageData, 0, 0);
				} else {
					Filter.applied.splice(Filter.applied.indexOf(name), 1);
					if (!this.apply)
						return;
					pasL.draw();
				}
				sessionStorage.setItem('Favnekon', (
					this.link.href =  this.canvas.toDataURL()
				));
		}
	}
};

Favnekon.link    = _setup('link', { id: 'favn__3kon', rel: 'icon', type: 'image/png', href: Favnekon.apply });
Favnekon.image   = _setup('img' , { id: 'nk3__workaroundImage' }, { error: imageReset, load: imageLoad });
Favnekon.overlay = _setup('div' , { id: 'nk3__shadowBoxOverlay', html: `
	<div id="nk3__magnethingCard">
		<input id="nk3__addURLInput" type="text" placeholder="Image URL">
		<label id="nk3__overlayCloseBtn"></label>
		<citab>
			<canvas id="nk3__previewIcon" width="16" height="16" class="pre-fav${ Favnekon.apply ? ' ch-x-k" style="background: url('+Favnekon.apply+') no-repeat center;' : '' }"></canvas>
			<img id="nk3__faviconDefault" width="16" height="16" class="pre-fav${ Favnekon.apply ? '' : ' ch-x-k' }">
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
			<div id="nk3__dropDownArrow"><input type="file" hidden></div>
		</droparea>
	</div>`
}, { 
	click: Favnekon
});

Favnekon.canvas = Favnekon.overlay.querySelector('#nk3__previewIcon');
Favnekon.def    = Favnekon.overlay.querySelector('#nk3__faviconDefault');
Favnekon.drop   = _setup(Favnekon.overlay.querySelector('droparea'), null, { dragover: e => { e.preventDefault() }, drop: fileUpload });

Favnekon.drop.children['nk3__dropDownArrow'].addEventListener('change', fileUpload);
Favnekon.overlay.querySelector('.brithnes').addEventListener('mousedown', barChanger);

chrome.runtime.connect(chrome.runtime.id, { name: Favnekon.id })
   .onMessage.addListener(({ action, data }) => { Favnekon[action](data) });

Favnekon.overlay
	.querySelector('#nk3__addURLInput')
	.addEventListener('input', ({ target }) => {
		const [, url, data] = /(https?\:\/\/[^\/]+\/[^\s]+)|(data\:image\/[^\s]+)/.exec(target.value) || [];
		if (url) {
			chrome.runtime.sendMessage(url);
		} else if (data) {
			Favnekon.pushKat(data);
			target.value = '';
		}
	});

const contxt  = Favnekon.canvas.getContext('2d');
      contxt.drawImage(Favnekon.image, 0, 0, (contxt.clearW = 16), (contxt.clearH = 16));

const pasL = (() => {
	
	const box = _setup('div', { id: 'pasL_box', style: 'position: absolute;' }),
	   shift  = { ptp: '', sX: 0, sY: 0, eX: 0, eY: 0 },
	   coords = { x1: 0, y1: 0, w: 0, h: 0, x2: 0, y2: 0 },
	   events = { mousemove: areaMovement, mouseup: () => _setup(window, drawImage(), { remove: events }) },
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
		coords.w  = points.w || 16;
		coords.h  = points.h || 16;
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

const Filter = {
	
	brightness : -0,
	applied    : [],
	
	'gray': (data) => {
		for (var i = 0; i < data.length; i += 4) {
			data[i + 2] = data[i + 1] = data[i] = (0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2]);
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
			data[i + 1] = 255 - data[i + 1];
			data[i + 2] = 255 - data[i + 2];
		}
	},
	'expose': (data) => {
		for (var i = 0, wb = Math.round(2.55 * this.brightness); i < data.length; i += 4) {
			data[i]     = data[i]     + wb;
			data[i + 1] = data[i + 1] + wb;
			data[i + 2] = data[i + 2] + wb;
		}
	}
}

document.addEventListener('DOMContentLoaded', function onReady() {
	
	this.removeEventListener('DOMContentLoaded', onReady);
	
	const head = this.getElementsByTagName('head')[0],
	    favico = head.querySelectorAll('link[rel$="icon"], link[rel="icon"]');
	
	if (favico.length) {
		
		Favnekon.def.src = Favnekon.apply ? favico[0].href : (Favnekon.link.href = favico[0].href);
		
		for (var i = 0; i < favico.length; i++) {
			head.removeChild(favico[i]);
		}
	}
	head.appendChild(Favnekon.link);
});

function RGB_transform(m, data) {
	for (var i = 0; i < data.length; i += 4) {
		let r = data[i], g = data[i + 1], b = data[i + 2];
		data[i]     = r * m[0]  + g * m[1]  + b * m[2]  + m[4]  * 255;
		data[i + 1] = r * m[5]  + g * m[6]  + b * m[7]  + m[9]  * 255;
		data[i + 2] = r * m[10] + g * m[11] + b * m[12] + m[14] * 255;
	}
}

function RGBA_transform(m, data) {
	for (var i = 0; i < data.length; i += 4) {
		let r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
		data[i]     = r * m[0]  + g * m[1]  + b * m[2]  + a * m[3]  + m[4]  * 255;
		data[i + 1] = r * m[5]  + g * m[6]  + b * m[7]  + a * m[8]  + m[9]  * 255;
		data[i + 2] = r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14] * 255;
		data[i + 3] = r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19] * 255;
	}
}

function barChanger(e) {
	e.preventDefault();
	
	const rect = this.getBoundingClientRect();
	const bar  = this.firstElementChild;
	const imageData = contxt.getImageData(0, 0, 16, 16);
	
	const calc = (n) => {
		if (n > 100) {
			bar.style.left = '100%';
			Filter['brightness'](100, imageData.data);
		} else if (n < 0) {
			bar.style.left = '0';
			Filter['brightness'](-100, imageData.data);
		} else {
			if (n > 48 && n < 51) {
				bar.style.left = '50%';
				Filter['brightness'](0, imageData.data);
			} else {
				bar.style.left = (n = Math.round(n)) +'%';
				Filter['brightness']((n < 50 ? n * -2 : n * 2), imageData.data);
			}
		}
		contxt.putImageData(imageData, 0, 0);
	};
	
	let x = (e.clientX - rect.left) / ('width' in rect ? rect.width : (rect.width = rect.right - rect.left));
	//let [n, p] = x > 1 ? [100, 1] : x < 0 ? [0, -1] : (x *= 100) > 48 && x < 51 ? [50, 0.5] : [Math.round(x), Math.round(x) / 100];
	//bar.style.left = n +'%';
	bar.style['background-color'] = 'green';
	calc(x * 100);
	const barMove = (e) => {
		let x = (e.clientX - rect.left) / rect.width;
		//n = x > 1 ? 100 : x < 0 ? 0 : (x *= 100) > 48 && x < 51 ? 50 : Math.round(x);
		//let [n, p] = x > 1 ? [100, 1] : x < 0 ? [0, -1] : (x *= 100) > 48 && x < 51 ? [50, 0] : [Math.round(x), Math.round(x) / 100];
		//Filter['brightness'](p, imageData.data);
		//contxt.putImageData(imageData, 0, 0);
		//bar.style.left = n +'%';
		calc(x * 100);
	}
	const barEnd = () => {
		bar.style['background-color'] = 'inherit';
		window.removeEventListener('mousemove', barMove, false);
		window.removeEventListener('mouseup', barEnd, false);
	}
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
	Favnekon.image.remove();
	pasL.box.remove();
}

function fileUpload(e) {
	e.preventDefault();
	var data = e.dataTransfer || e.target,
		file = data.files[0];
	if (file && /image\//.test(file.type)) {
		Favnekon.pushKat( URL.createObjectURL(file) );
	}
}

function drawFavnekon(X, Y, W, H) {
	try {
		contxt.clearRect(0, 0, contxt.clearW, contxt.clearH);
	} finally {
		var step = Math.ceil(Math.log((H > W ? H : W) / 16) / Math.log(2));
		if (step <= 1) {
			contxt.drawImage(Favnekon.image, X, Y, W, H, 0, 0, 16, 16);
		} else {
			let width  = (contxt.clearW = W) * 0.5,
				height = (contxt.clearH = H) * 0.5,
				oc     = _setup('canvas', { width, height }),
				octx   = oc.getContext('2d');
				
			octx.drawImage(Favnekon.image, X, Y, W, H, 0, 0, width, height);
			
			while ((step--) > 2) {
				width  *= 0.5;
				height *= 0.5;
				octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
			}
			
			contxt.drawImage(oc, 0, 0, width, height, 0, 0, 16, 16);
		}
		
		if (Filter.applied.length) {
			const imageData = contxt.getImageData(0, 0, 16, 16);
			for (let name of Filter.applied) {
				Filter[name](imageData.data);
			}
			contxt.putImageData(imageData, 0, 0);
		}
		
		if (Favnekon.apply) {
			sessionStorage.setItem('Favnekon', (
				Favnekon.link.href = Favnekon.canvas.toDataURL()
			));
		}
	}
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
