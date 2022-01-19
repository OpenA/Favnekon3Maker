
const is_node_app = typeof require === 'function';

const GLOBAL_PARAMS = {
	demotivator: false,
	figures: [],
	texts: []
};

const crop = new PasL({ lock: false, edgies: true });

const TEXT_OBJECT = {
	curr_el: null,

	default: Object.freeze({
		stroke_color : '#2e3436',
		stroke_size  : 2,
		font_family  : 'sans-serif',
		style_italic : false,
		text_color   : '#f3f3f3',
		style_bold   : true,
		font_size    : 64,
		text_align   : 'center',
		text_content : 'Example Text'
	}),

	apply(key, param, val) {

		if (!this.curr_el)
			return;

		const { style, id } = this.curr_el,
		     idx = Number(id.substring('txt_obj_'.length)) - 1,
		  params = GLOBAL_PARAMS.texts[idx];

		if (param === 'size') {
			style[
				key === 'stroke' ? '-webkit-text-stroke-width' :
				key === 'font'   ? 'font-size' : ''] = `${val}px`;
		} else if (param === 'family') {
			style['font-family'] = `"${val}"`;
		} else if (key === 'style') {
			style[
				param === 'bold'   ? 'font-weight' :
				param === 'italic' ? 'font-style'  : ''] = val ? param : null;
		} else {
			style[
				param === 'color'  ? `${key === 'stroke' ? '-webkit-text-stroke-' : ''}color` :
				param === 'align'  ? 'text-align' : '' ] = val;
		}
		if (params)
			params[key +'_'+ param] = val;
	},

	create(copy_id = -1) {
		const ctxt = GLOBAL_PARAMS.texts[copy_id];

		const p = Object.assign({}, ctxt || this.default),
		    num = GLOBAL_PARAMS.texts.push(p);

		const el = _setup('code', {
			id    : 'txt_obj_'+ num,
			class : 'macro-text',
			text  : p.text_content
		}, {
			dblclick: () => { el.contentEditable = true; },
			input   : () => { p.text_content = el.innerText; }
		});
		el.style['-webkit-text-stroke-width'] = `${p.stroke_size}px`;
		el.style['-webkit-text-stroke-color'] = p.stroke_color;
		el.style.fontFamily = `"${p.font_family}"`;
		el.style.fontSize   = `${p.font_size}px`;
		el.style.color      = p.text_color;
		el.style.textAlign  = p.text_align;
		el.style.fontWeight = p.style_bold ? 'bold' : null;
		el.style.fontStyle  = p.style_italic ? 'italic' : null;
		return (this.curr_el = el);
	},

	capture(el) {
		const { id } = (this.curr_el = el),
		     idx = Number(id.substring('txt_obj_'.length)) - 1;
		return GLOBAL_PARAMS.texts[idx];
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const gl_params = document.getElementById('global_params'),
	      gl_elems  = gl_params.getElementsByTagName('input');

	const canvas = document.getElementById('preview_canvas');
	const outbtn = document.getElementById('out_nothing');
	const wrkimg = document.getElementById('work_img');
	const wlayer = document.getElementById('work_layer');
	const edit_z = document.getElementById('editable_zone');

	gl_params.addEventListener('change', ({ target }) => {
		let [ key, param, val ] = target.id.split('_');

		if (key === 'file') {
			wrkimg.src = URL.createObjectURL(target.files[0]);
		} else {
			const type = target.type;
			if(!val) {
				val = target[
				  !type ? target.innerText :
				   type === 'number' ? 'numberValue' :
				   type === 'checkbox' ? 'checked' : 'value'
				];
			}
			TEXT_OBJECT.apply(key, param, val);
		}
	});

	const font_family = document.getElementById('font_family');

	font_family.nextElementSibling.addEventListener(onScreen.PointDown, e => {
		const el = e.target;
		if (el.classList[0] === 'dropdown-item') {
			TEXT_OBJECT.apply('font', 'family', (
				font_family.value = el.innerText
			));
		}
		e.preventDefault();
	});

	gl_params.firstElementChild.addEventListener('click', e => {
		const el = e.target;
		if (el.id === 'Macro') {
			wlayer.append(
				TEXT_OBJECT.create()
			);
		}
		e.preventDefault();
	});

	outbtn.addEventListener(onScreen.PointDown, e => {
		const el = e.target, { classList, id } = el;
		if (classList[0] === 'out-btn') {
			if (id === 'out_apply') {
				clearResult(canvas);
				 drawResult(canvas, wrkimg);
				el.id = 'out_save';
			} else if (id === 'out_save') {
				classList.toggle('active');
			}
		} else {
			if (classList[0] === 'dropdown-item') {
				const type = el.getAttribute('out-type');
			}
			classList.remove('avtive');
		}
		e.preventDefault();
	});

	edit_z.addEventListener(onScreen.PointDown, e => {
		const el = e.target;
		if (el.classList[0] === 'macro-text') {
			const stores = TEXT_OBJECT.capture(el);
			for (let key in stores) {
				const elem =  document.getElementById(key);
				if (elem) {
					elem[(
						elem.type === 'checkbox' ? 'checked' : 'value'
					)] = stores[key];
				}
			}
			gl_params.classList.add('disp-font', 'disp-stroke');
			if (!el.contentEditable) {
				// move
			} else return;
		} else {
			TEXT_OBJECT.curr_el = null;
		}
		for (const code of wlayer.querySelectorAll('.macro-text[contenteditable="true"]')) {
			code.contentEditable = false;
		}
	});
	edit_z.addEventListener('click', e => {
		const el = e.target, [cls_main, cls_sec] = el.classList;
		switch (cls_main) {
		case 'file-area':
			if (wrkimg.src){
				const url = wrkimg.src;
				wrkimg.removeAttribute('src');
				crop.box.remove();
				if (/^blob\:/.test(url))
					URL.revokeObjectURL(url);
			} else
				gl_elems.file_upload.click();
		}
	});
	wrkimg.addEventListener('load', () => {

		const { width, height } = wrkimg;

		crop.setZone(width, height);
		wlayer.prepend(crop.box);
		outbtn.id = 'out_apply';
	});

	for (const sr of gl_params.querySelectorAll('.size-ruler')) {
		sr.addEventListener(onScreen.PointDown, onRulChange);
		sr.addEventListener('input', e => {
			/*...*/ clearTimeout(sr._t);
			sr._t = setTimeout(onRulChange.bind(sr, e), 500);
		});
	}
});

const clearResult = canvas => {
	const contxt = canvas.getContext('2d');
	contxt.clearRect(0, 0, canvas.width, canvas.height);
}

const drawResult = (canvas, img) => {

	const scale = img.naturalWidth / img.width;
	const [x, y, w, h] = crop.getCoords(scale);

	canvas.width = w, canvas.height = h;

	const contxt = canvas.getContext('2d');

	contxt.drawImage(img, x, y, w, h, 0, 0, w, h);

	for (const t of GLOBAL_PARAMS.texts) {
		if (!t) continue;
		contxt.font        = `${t.style_italic} ${t.style_bold} ${t.font_size}px "${t.font_family}"`;
		contxt.lineWidth   = t.stroke_size;
		contxt.strokeStyle = t.stroke_color;
		contxt.fillStyle   = t.text_color;
		contxt.textAlign   = t.text_align;
		contxt.textBaseline = 'bottom';
		contxt.fillText(t.text_content, w/2, 0, w);
		contxt.strokeText(t.text_content, w/2, 0, w);
	}
}

function onRulChange(e) {

	const slider = this.lastElementChild,
	      params = slider.previousElementSibling,
	      value  = params.lastElementChild;

	if (e.type !== 'input' && (e.button !== 0 || e.target === value))
		return;

	const { left, width } = this.getBoundingClientRect();

	const marginX = slider.clientWidth,
	      maxLeft = width - marginX;

	const name = params.getAttribute('label');
	const min  = Number(params.getAttribute('min'));
	const max  = Number(params.getAttribute('max'));
	const step = params.getAttribute('step');

	let x, i = step && step.indexOf('.') + 1,
	    v, r = i ? step.substring(i).length * 10 : 1;

	if (e.type === 'input') {
		v = value.textContent;
		v = v ? (i ? Math.floor(parseFloat(v) * r) / r : parseInt(v)) : 0;
		if (v < min) {
			v = min, x = 0;
		} else  if ( v > max ) {
			v = max, x = maxLeft;
		} else {
			x = Math.floor(maxLeft * ((v - min) / (max - min)));
		}
		slider.style.left = `${x}px`;
		value.textContent = v.toString();
		TEXT_OBJECT.apply(name, 'size', v);
	} else {
		const onMove = ({ clientX }) => {
			let x = clientX - left - marginX;
			if (x < 0) {
				v = min, x = 0;
			} else  if ( x > maxLeft) {
				v = max, x = maxLeft;
			} else {
				v = Math.floor((clientX - left) / width * max * r) / r;
			}
			slider.style.left = `${x}px`;
			value.textContent = v.toString();
			TEXT_OBJECT.apply(name, 'size', v);
		}
		const onEnd = () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onEnd);
		}
		if (e.target !== slider)
			onMove(e);
		e.preventDefault();
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onEnd);
	}
}
