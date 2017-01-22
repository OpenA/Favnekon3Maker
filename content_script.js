
var Favnekon = {
	id: 'n3kon3kt',
	apply: !!sessionStorage.getItem('Favnekon'), 
	link: _Zetup('link', {'id': 'favn__3kon', 'rel': 'shortcut icon', 'type': 'image/x-icon', 'href': sessionStorage['Favnekon']})
}

var _Runtime = (typeof browser !== 'undefined' ? browser : chrome).runtime;
	_Runtime.connect(_Runtime.id, { name: Favnekon.id });
	_Runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.action === 'pushKat') {
			pushKat(request.uri);
		}
	});
		
var work_image = _Zetup('img', { id: 'nk3__workaroundImage', src: sessionStorage['Favnekon'] }, { error: imageReset, load: imageLoad });
var overlay = _Zetup('div', {
		id: 'nk3__shadowBoxOverlay',
		html: '<div id="nk3__magnethingCard">'+
				'<input id="nk3__addURLInput" type="text" placeholder="Image URL">'+
				'<label id="nk3__overlayCloseBtn"></label>'+
				'<citab><canvas id="nk3__previewIcon" class="pre-fav'+
					(Favnekon.apply ? ' ch-x-k' : '') +'" width="16" height="16"></canvas><img id="nk3__faviconDefault" class="pre-fav'+
					(Favnekon.apply ? '' : ' ch-x-k') +'" width="16" height="16"></citab>'+
				'<droparea><div id="nk3__dropDownArrow"><input type="file" hidden></div></droparea></div>'}, {
		click: function(e) {
			switch (e.target.id) {
				case 'nk3__overlayCloseBtn':
					this.remove();
					break;
				case 'nk3__dropDownArrow':
					e.target.firstElementChild.click();
					break;
				case 'nk3__faviconDefault':
					Favnekon.apply = false;
					Favnekon.link.href = defavult.src;
					sessionStorage.removeItem('Favnekon');
					canvas.classList.remove('ch-x-k');
					defavult.classList.add('ch-x-k');
					break;
				case 'nk3__previewIcon':
					Favnekon.apply = true;
					Favnekon.link.href = e.target.toDataURL();
					sessionStorage.setItem('Favnekon', Favnekon.link.href);
					defavult.classList.remove('ch-x-k');
					canvas.classList.add('ch-x-k');
			}
		}}),
	defavult = overlay.querySelector('#nk3__faviconDefault'),
	droparea = _Zetup(overlay.getElementsByTagName('droparea')[0], null, { dragover: fallback, drop: fileUpload }),
	dwnarrow = _Zetup(droparea.children['nk3__dropDownArrow'], null, { change: fileUpload }),
	canvas = overlay.querySelector('#nk3__previewIcon'),
	contxt = canvas.getContext('2d');
	
	contxt.drawImage(work_image, 0, 0, (contxt.clearW = 16), (contxt.clearH = 16));
	
	_Zetup(overlay.children['nk3__magnethingCard'].children['nk3__addURLInput'], null, {
		input: function(e) {
			var uri = /(https?\:\/\/[^\/]+\/[^\s]+)|(data\:image\/[^\s]+)/.exec(this.value) || [];
			if (uri[1]) {
				_Runtime.sendMessage({ uri: uri[1] });
			} else if (uri[2]) {
				pushKat(uri[2]);
				this.value = '';
			}
		}});
		
	
var pasL = (function() {
	var	behind = {},
		shift  = { ptp: '', sX: 0, sY: 0, eX: 0, eY: 0 },
		coords = { x1: 0, y1: 0, w: 0, h: 0, x2: 0, y2: 0 },
		events = { mousemove: areaMovement, mouseup: removeDocsFn},
		box    = _Zetup('div', {'id': 'pasL_box', 'style': 'position: absolute;'});
	
	_Zappend(box, [
		(behind['left']   = _Zetup('div', {id: 'pasl_behind_left',  class: 'pasl-col-sect pasl-dark'})),
		(behind['center'] = _Zetup('div', {                         class: 'pasl-col-sect'})),
		(behind['right']  = _Zetup('div', {id: 'pasl_behind_right', class: 'pasl-col-sect pasl-dark'}))
	]);
	
	_Zappend(behind['center'], [
		(behind['top']       = _Zetup('div', {id: 'pasl_behind_top',       class: 'pasl-row-sect pasl-dark'})),
		(behind['selection'] = _Zetup('div', {id: 'pasl_behind_selection', class: 'pasl-selection-area', html: '<div class="pasl-rcons" id="rcon_t-l"></div><div class="pasl-rcons" id="rcon_t-r"></div><div class="pasl-rcons" id="rcon_b-l"></div><div class="pasl-rcons" id="rcon_b-r"></div>'}, {
			mousedown: function (e) {
				fallback(e);
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
				_Zetup(document, null, events);
			}
		})),
		(behind['bottom'] = _Zetup('div', {id: 'pasl_behind_bottom',    class: 'pasl-row-sect pasl-dark'}))
	]);
	
	var SelectArea = {
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
				coords.w = coords.size[0] > n + coords.x1 ? (n > 0 ? n : 0) : coords.size[0] - coords.x1;
				behind.selection.style['width'] = coords.w +'px';
				coords.x2 = coords.size[0] - coords.x1 - coords.w;
				behind.right.style['width'] = coords.x2 +'px';
			},
		get 'h' ( ) { return coords.h },
		set 'h' (n) {
				coords.h = coords.size[1] > n + coords.y1 ? (n > 0 ? n : 0) : coords.size[1] - coords.y1;
				behind.selection.style['height'] = coords.h +'px';
				coords.y2 = coords.size[1] - coords.y1 - coords.h;
				behind.bottom.style['height'] = coords.y2 +'px';
			},
		get 'rw'( ) { return coords.w },
		set 'rw'(n) {
				coords.w = coords.size[0] > n + coords.x2 ? (n > 0 ? n : 0) : coords.size[0] - coords.x2;
				behind.selection.style['width'] = coords.w +'px';
				coords.x1 = coords.size[0] - coords.x2 - coords.w;
				behind.left.style['width'] = coords.x1 +'px';
			},
		get 'rh'( ) { return coords.h },
		set 'rh'(n) {
				coords.h = coords.size[1] > n + coords.y2 ? (n > 0 ? n : 0) : coords.size[1] - coords.y2;
				behind.selection.style['height'] = coords.h +'px';
				coords.y1 = coords.size[1] - coords.y2 - coords.h;
				behind.top.style['height'] = coords.y1 +'px';
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
		fallback(e);
	}
	function removeDocsFn(e) {
		SelectArea.onSelectEnd({
			x: coords.x1, y: coords.y1, w: coords.w, h: coords.h,
			natural: {
				x: Math.floor(coords.x1 * coords.ratio[0]),
				y: Math.floor(coords.y1 * coords.ratio[1]),
				w: Math.floor(coords.w * coords.ratio[0]),
				h: Math.floor(coords.h * coords.ratio[1])}
		});
		_Zetup(document, null, { remove: events });
	}
	function areaSelect(img, points) {
		box.style['width' ] = img.width  +'px';
		box.style['height'] = img.height +'px';
		coords.size = [img.width, img.height];
		coords.ratio = [img.naturalWidth / img.width, img.naturalHeight / img.height];
		coords.x1 = points.x || 0
		coords.y1 = points.y || 0
		coords.w  = points.w || 16
		coords.h  = points.h || 16
		for (var vec in points) {
			SelectArea[vec] = points[vec];
		}
	}
	return {
		box: box,
		select: areaSelect
	}
})();

function pushKat(imgSrc) {
	if (!imgSrc) {
		imageReset();
	} else {
		work_image.src = imgSrc;
		dwnarrow.remove();
		droparea.appendChild(work_image);
		droparea.insertBefore(pasL.box, work_image);
	}
	document.body.appendChild(overlay);
}

function imageLoad() {
	
	var eObj = {
		lock: true,
		x: 0, w: this.width,
		y: 0, h: this.height,
		onSelectEnd: drawFavnekon
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
	droparea.appendChild(dwnarrow);
	work_image.remove();
	pasL.box.remove();
}

function fileUpload(e) {
	fallback(e);
	var data = e.dataTransfer || e.target,
		file = data.files[0];
	if (file && /image\//.test(file.type)) {
		pushKat((window.URL || window.webkitURL).createObjectURL(file));
	}
}

function drawFavnekon(s) {
	try {
		contxt.clearRect(0, 0, contxt.clearW, contxt.clearH);
	} finally {
		var step = Math.ceil(Math.log(s.natural[s.natural.h > s.natural.w ? 'h' : 'w'] / 16) / Math.log(2));
		if (step <= 1) {
			contxt.drawImage(work_image, s.natural.x, s.natural.y, s.natural.w, s.natural.h, 0, 0, 16, 16);
		} else {
			var ssw = (contxt.clearW = s.natural.w) * 0.5;
			var ssh = (contxt.clearH = s.natural.h) * 0.5;
			var oc  = _Zetup('canvas', { width: ssw, height: ssh }),
				octx = oc.getContext('2d');
				
			octx.drawImage(work_image, s.natural.x, s.natural.y, s.natural.w, s.natural.h, 0, 0, oc.width, oc.height);
			
			while ((step--) > 2) {
				ssw *= 0.5;
				ssh *= 0.5;
				octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
			}
			
			contxt.drawImage(oc, 0, 0, ssw, ssh, 0, 0, 16, 16);
		}
		
		if (Favnekon.apply) {
			Favnekon.link.href = canvas.toDataURL();
			sessionStorage.setItem('Favnekon', Favnekon.link.href);
		}
	}
}

function _Zetup(el, _Attrs, _Events) {
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
				             &&  el[key]      === _Attrs[key] || el.setAttribute(key, _Attrs[key]);
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

function _Zappend(el, nodes) {
	if (el) {
		if (typeof el === 'string') {
			el = document.querySelector(el);
		}
		for (var i = 0; i < nodes.length; i++) {
			el.appendChild(nodes[i]);
		}
	}
}

function fallback(e) {
	if (e.preventDefault)
		e.preventDefault();
	else
		e.returnValue = false;
}
