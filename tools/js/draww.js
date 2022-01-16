
const is_node_app = typeof require === 'function';

const GLOBAL_PARAMS = {
	demotivator: false,
	figures: [],
	texts: []
};

const crop = new PasL({ lock: false, edgies: true });

const TEXT_OBJECT = {
	curr_id: '',

	default: Object.freeze({
		stroke_color : '#2e3436',
		stroke_size  : 2,
		font_family  : 'sans-serif',
		font_italic  : false,
		font_color   : '#f3f3f3',
		font_bold    : true,
		font_size    : 64,
		text_align   : 'center',
		text_content : 'Example Text'
	}),

	create(copy_id = -1) {
		const ctxt = GLOBAL_PARAMS.texts[copy_id];

		const {
			stroke_color, stroke_size,
			font_family, font_italic,
			font_color, font_bold,
			font_size, text_align,
			text_content
		} = ctxt ? ctxt : this.default;

		const idx = GLOBAL_PARAMS.texts.push({
			stroke_color, stroke_size,
			font_family, font_italic,
			font_color, font_bold,
			font_size, text_align,
			text_content
		});

		const code = _setup('code', {
			id: 'txt_obj_'+ idx,
			class: 'macro-text',
			text: text_content,
			style: ''+
			`color: ${font_color}; text-align: ${text_align}; `+
			`font: ${font_bold ? 'bold' : ''} ${font_italic ? 'italic' : ''} ${font_size}px "${font_family}"; `+
			`-webkit-text-stroke: ${stroke_size}px ${stroke_color};`
		}, {
			dblclick: () => { code.contentEditable = true; },
			input   : () => { GLOBAL_PARAMS.texts[idx] = code.innerText; }
		});

		return code;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const form_params = document.forms.global_params,
	      form_elems  = form_params.elements;

	const canvas = document.getElementById('preview_canvas');
	const outbtn = document.getElementById('out_nothing');
	const wrkimg = document.getElementById('work_img');
	const wlayer = document.getElementById('work_layer');
	const edit_z = document.getElementById('editable_zone');

	form_params.addEventListener('change', ({ target }) => {
		switch (target.id) {
		case 'file_upload':
			wrkimg.src = URL.createObjectURL(target.files[0]);
			break;
		}
	});

	form_elems.font_family.nextElementSibling.addEventListener('pointerdown', e => {
		const el = e.target;
		if (el.classList[0] === 'dropdown-item') {
			form_elems.font_family.value = el.innerText;
		}
		e.preventDefault();
	});

	form_params.firstElementChild.addEventListener('click', e => {
		const el = e.target;
		if (el.id === 'Macro') {
			wlayer.append(
				TEXT_OBJECT.create()
			);
		}
		e.preventDefault();
	});

	outbtn.addEventListener('pointerdown', e => {
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

	edit_z.addEventListener('pointerdown', e => {
		const el = e.target;
		e.preventDefault();
		if (el.classList[0] === 'macro-text') {
			if (!el.contentEditable) {
				// move
			} else return;
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
				form_elems.file_upload.click();
			
		}
	});
	wrkimg.addEventListener('load', () => {

		let x = 0, y = 0, w = wrkimg.width, h = wrkimg.height;
	
		if (w > h) {
			x = (w - h) * .5, w = h;
		} else if (w < h) {
			y = (h - w) * .5, h = w;
		}
		crop.selectZone(wrkimg, x, y, w, h);
		wlayer.prepend(crop.box);
		outbtn.id = 'out_apply';
	});
	crop.box.style.zIndex = null;

	for (const sr of form_params.querySelectorAll('.size-ruler')) {
		sr.addEventListener('mousedown', onRulChange);
		//sr.addEventListener('input', onRulChange);
	}
});

const clearResult = canvas => {
	const contxt = canvas.getContext('2d');
	contxt.clearRect(0, 0, canvas.width, canvas.height);
}

const drawResult = (canvas, img) => {

	const [x, y, w, h] = crop.getCoords();

	canvas.width = w, canvas.height = h;

	const contxt = canvas.getContext('2d');

	contxt.drawImage(img, x, y, w, h, 0, 0, w, h);

	for (const t of GLOBAL_PARAMS.texts) {
		if (!t) continue;
		contxt.font        = `${t.font_italic} ${t.font_bold} ${t.font_size}px "${t.font_family}"`;
		contxt.lineWidth   = t.stroke_size;
		contxt.strokeStyle = t.stroke_color;
		contxt.fillStyle   = t.font_color;
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

	if (e.button !== 0 || e.target === value)
		return;
	e.preventDefault();

	const { left, width } = this.getBoundingClientRect();

	const marginX = slider.clientWidth,
	      maxLeft = width - marginX;

	const name = params.getAttribute('label');
	const min  = Number(params.getAttribute('min'));
	const max  = Number(params.getAttribute('max'));

	const onMove = ({ clientX }) => {
		let s, x = clientX - left - marginX;
		if (x < 0) {
			s = min, x = 0;
		} else  if ( x > maxLeft) {
			s = max, x = maxLeft;
		} else {
			s = Math.floor((clientX - left) / width * max * 10) / 10;
		}
		slider.style.left = `${x}px`;
		value.textContent = s;
	}
	const onEnd = () => {
		window.removeEventListener('mousemove', onMove);
		window.removeEventListener('mouseup', onEnd);
	}
	if (e.target !== slider) {
		onMove(e);
	}
	window.addEventListener('mousemove', onMove);
	window.addEventListener('mouseup', onEnd);
}
