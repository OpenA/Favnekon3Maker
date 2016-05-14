
var Favnekon = {
	apply: !!sessionStorage.getItem('Favnekon'), 
	link: _Zetup('link', {'id': 'favn__3kon', 'rel': 'shortcut icon', 'type': 'image/x-icon', 'href': sessionStorage.getItem('Favnekon')})
}

var overlay = _Zetup('div', {'id': 'nk3__shadowBoxOverlay', 'html': '<div id="nk3__magnethingCard"><input id="nk3__addURLInput" type="text" placeholder="Image URL"><label id="nk3__overlayCloseBtn"></label><citab><canvas id="nk3__previewIcon" class="pre-fav'+
	(Favnekon.apply ? ' ch-x-k' : '') +'" width="16" height="16"></canvas><img id="nk3__faviconDefault" class="pre-fav'+
	(Favnekon.apply ? '' : ' ch-x-k') +'" width="16" height="16"></citab><droparea><img id="nk3__workaroundImage"></droparea>'}, {'click': function(e) {
		switch (e.target.id) {
			case 'nk3__overlayCloseBtn':
				this.remove();
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
	url_area = overlay.querySelector('#nk3__addURLInput'),
	wimage = overlay.querySelector('#nk3__workaroundImage'),
	canvas = overlay.querySelector('#nk3__previewIcon'),
	contxt = canvas.getContext("2d");
	contxt.imageSmoothingEnabled = true;
	url_area.oninput = function(e) {
		var uri = /(https?\:\/\/[^\/]+\/[^\s]+)|(data\:image\/[^\s]+)/.exec(this.value) || [];
		if (uri[1]) {
			chrome.extension.sendRequest({event: 'XHR', uri: uri[1]});
		} else if (uri[2]) {
			pushKat(uri[2]);
			this.value = '';
		}
	}
	_Zetup(wimage.parentNode, {}, {
		'dragover': function(e) {
			fallback(e);
		}, 'drop': function(e) {
				fallback(e);
				var data = e.dataTransfer, file = data.files[0],
					dataURI = data.getData ? data.getData(data.effectAllowed === 'copyLink' ? 'Text' : 'URL') : null;
				if (file) {
					var reader = new FileReader();
						reader.onload = function() {
							if (this.readyState > 0)
								pushKat(this.result);
						}
						reader.readAsDataURL(file);
				} else if (dataURI) {
					chrome.extension.sendRequest({event: 'XHR', uri: dataURI});
				}
		}})

var pasL = (function() {
	try {
		var	SelectArea = new Object(), shift,
		behind = {}, coords = {}, mouseEvents = {'mousemove': areaMovement, 'mouseup': removeDocsFn},
		box = _Zetup('div', {'id': 'pasL_box', 'style': 'position: absolute;', 'html': '<div id="pasl_behind_left" class="pasl-col-sect pasl-dark"></div><div class="pasl-col-sect"><div id="pasl_behind_top" class="pasl-row-sect pasl-dark"></div><div id="pasl_behind_selection" class="pasl-selection-area"><div class="pasl-rcons" id="rcon_t-l"></div><div class="pasl-rcons" id="rcon_t-r"></div><div class="pasl-rcons" id="rcon_b-l"></div><div class="pasl-rcons" id="rcon_b-r"></div></div><div id="pasl_behind_bottom" class="pasl-row-sect pasl-dark"></div></div><div id="pasl_behind_right" class="pasl-col-sect pasl-dark"></div>'}, {
			'mousedown': function (e) {
				shift = ['m-v', e.clientX, e.clientY, coords.x1, coords.y1];
				switch (e.target.classList[0]) {
					case 'pasl-rcons':
						shift = [e.target.id.split('_')[1], e.clientX, e.clientY, coords.w, coords.h];
					case 'pasl-selection-area':
						_Zetup(document, {}, mouseEvents);
						fallback(e);
				}
			}
		});
		for (var i = 0, pL = ['left', 'top', 'bottom', 'right', 'selection']; i < pL.length; i++) {
			behind[pL[i]] = box.querySelector('#pasl_behind_'+ pL[i]);
		}
		
		Object.defineProperties(SelectArea, {
			'x': {
				get: function() { return coords.x1 },
				set: function(n) {
					coords.x1 = n > 0 ? n : 0;
					if (coords.x1 + coords.w > coords.size[0]) {
						coords.x1 = coords.size[0] - coords.w;
					}
					coords.x2 = coords.size[0] - coords.x1 - coords.w;
					behind.left.style['width'] = coords.x1 +'px';
					behind.right.style['width'] = coords.x2 +'px';
				}},
			'y': {
				get: function() { return coords.y1 },
				set: function(n) {
					coords.y1 = n > 0 ? n : 0;
					if (coords.y1 + coords.h > coords.size[1]) {
						coords.y1 = coords.size[1] - coords.h;
					}
					coords.y2 = coords.size[1] - coords.y1 - coords.h;
					behind.top.style['height'] = coords.y1 +'px';
					behind.bottom.style['height'] = coords.y2 +'px';
				}},
			'w': {
				get: function() { return coords.w },
				set: function(n) {
					coords.w = coords.size[0] > n + coords.x1 ? (n > 0 ? n : 0) : coords.size[0] - coords.x1;
					behind.selection.style['width'] = coords.w +'px';
					coords.x2 = coords.size[0] - coords.x1 - coords.w;
					behind.right.style['width'] = coords.x2 +'px';
				}},
			'rw': {
				get: function() { return coords.w },
				set: function(n) {
					coords.w = coords.size[0] > n + coords.x2 ? (n > 0 ? n : 0) : coords.size[0] - coords.x2;
					behind.selection.style['width'] = coords.w +'px';
					coords.x1 = coords.size[0] - coords.x2 - coords.w;
					behind.left.style['width'] = coords.x1 +'px';
				}},
			'h': {
				get: function() { return coords.h },
				set: function(n) {
					coords.h = coords.size[1] > n + coords.y1 ? (n > 0 ? n : 0) : coords.size[1] - coords.y1;
					behind.selection.style['height'] = coords.h +'px';
					coords.y2 = coords.size[1] - coords.y1 - coords.h;
					behind.bottom.style['height'] = coords.y2 +'px';
				}},
			'rh': {
				get: function() { return coords.h },
				set: function(n) {
					coords.h = coords.size[1] > n + coords.y2 ? (n > 0 ? n : 0) : coords.size[1] - coords.y2;
					behind.selection.style['height'] = coords.h +'px';
					coords.y1 = coords.size[1] - coords.y2 - coords.h;
					behind.top.style['height'] = coords.y1 +'px';
				}}
		})
		function areaMovement(e) {
			var rx, x = e.clientX - shift[1] + shift[3],
				ry, y = e.clientY - shift[2] + shift[4];
			switch (shift[0]) {
				case 'm-v':
					SelectArea.x = x;
					SelectArea.y = y;
					break;
				case 't-l':
					rx = shift[1] - e.clientX + shift[3];
					ry = shift[2] - e.clientY + shift[4];
					SelectArea.rw = SelectArea.lock && ry > rx ? ry : rx;
					SelectArea.rh = SelectArea.lock && rx > ry ? rx : ry;
					break;
				case 't-r':
					ry = shift[2] - e.clientY + shift[4];
					SelectArea.w  = SelectArea.lock && ry > x ? ry : x;
					SelectArea.rh = SelectArea.lock && x > ry ? x : ry;
					break;
				case 'b-l':
					rx = shift[1] - e.clientX + shift[3];
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
			if (typeof SelectArea.onSelectEnd === 'function') {
				SelectArea.onSelectEnd({
					x: coords.x1, y: coords.y1, w: coords.w, h: coords.h,
					natural: {
						x: Math.floor(coords.x1 * coords.ratio[0]),
						y: Math.floor(coords.y1 * coords.ratio[1]),
						w: Math.floor(coords.w * coords.ratio[0]),
						h: Math.floor(coords.h * coords.ratio[1])}
				});
			}
			_Zetup(document, {}, {'remove': mouseEvents});
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
	} catch(e) {
		console.error(e)
	}
})();

function pushKat(imgSrc) {
	wimage.onload  = !!imgSrc ? imageLoad : null;
	wimage.classList[!!imgSrc ? 'remove'  : 'add']('drop-sp-imgstb');
	wimage.src = imgSrc || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjE1MHB4IiB2aWV3Qm94PSIwIDAgMjAwIDE1MCIgdmVyc2lvbj0iMS4xIj48ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj48cGF0aCBkPSJNMTM5LjY4NzUsNTkuNzY1NDMxNyBMMTM5LjY4NzUsNjYuNDA1NjM1NiBMMTUzLjUwMDk3Nyw2Ni40MDU2MzU2IEw5OS44ODAzNzEyLDkwLjc0NTg1MjIgTDQ2LjI1OTc2NTcsNjYuNDA1NjM1NiBMNjEuNzE1NDk0OSw2Ni40MDU2MzU2IEw2MS43MTU0OTQ5LDU5Ljc2NTQzMTYgTDEzOS42ODc1LDU5Ljc2NTQzMTcgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjOEE5MkE1IiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+PC9nPjwvc3ZnPg==';
	if (!imgSrc) {
		pasL.box.remove();
	}
	document.body.appendChild(overlay);
}

function imageLoad() {
	
	var eObj = {
		onSelectEnd: drawFavnekon,
		y: 0, h: this.height,
		x: 0, w: this.width,
		lock: true
	}
	
	if (this.width > this.height) {
		eObj.w = this.height;
		eObj.x = (this.width - this.height) / 2;
	} else if (this.width < this.height) {
		eObj.h = this.width;
		eObj.y = (this.height - this.width) / 2;
	}
	
	pasL.select(this, eObj);
	this.parentNode.insertBefore(pasL.box, this);
}

function drawFavnekon(s) {
	try {
		contxt.clearRect(0, 0, Favnekon.w, Favnekon.h);
	} finally {
		Favnekon.w = s.natural.w;
		Favnekon.h = s.natural.h;
		contxt.drawImage(wimage, s.natural.x, s.natural.y, s.natural.w, s.natural.h, 0, 0, 16, 16);
		if (Favnekon.apply) {
			Favnekon.link.href = canvas.toDataURL();
			sessionStorage.setItem('Favnekon', Favnekon.link.href);
		}
	}
}

function _Zetup(el, attr, events) {
	if (el) {
		el = typeof el === 'string' ? document.createElement(el) : el;
		if (attr) {
			for (var key in attr) {
				attr[key] === undefined ? el.removeAttribute(key) :
				key === 'html' ? el.innerHTML   = attr[key] :
				key === 'text' ? el.textContent = attr[key] :
				key in el      ? el[key]        = attr[key] :
				el.setAttribute(key, attr[key]);
			}
		}
		if (events) {
			for (var key in events) {
				if (key === 'remove') {
					for (var evr in events[key]) {
						 el.removeEventListener(evr, events[key][evr], false);
					}
				} else {
					el.addEventListener(key, events[key], false);
				}
			}
		}
	}
	return el;
}

function fallback(e) {
	if (e.preventDefault)
		e.preventDefault();
	else
		e.returnValue = false;
}

function defaultSet(favSrc) {
	if (!Favnekon.apply)
		Favnekon.link.href = favSrc;
	defavult.src = favSrc;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action === 'pushKat') {
		pushKat(request.uri);
	}
});
