const { runtime, i18n, tabs } = typeof browser !== 'undefined' ? browser : chrome;

const Q_HEIGHT = 32;
const R_MARGIN = 8;

const calcBounds =  num  => Q_HEIGHT * num + R_MARGIN * num;
const getCellNum = (x,y) => x / (Q_HEIGHT + R_MARGIN) + MAX_COLS * (y / (Q_HEIGHT + R_MARGIN));
const n3conSel   = document.getElementById('n3cons_sel');
const menufillUp = document.getElementById('menu_fill_up');
const n3conPages = document.getElementById('n3cons_pages');
const n3consView = document.getElementById('n3cons_view');

const MAX_COLS = 4;
const MAX_ROWS = 6;

n3consView.width  = calcBounds(MAX_COLS); // columns
n3consView.height = calcBounds(MAX_ROWS); // rows

let _X = -1, _Y = -1, _N = 0, PAGES = [];

n3conSel.addEventListener('mousedown', e => {
	if (e.button === 0 && PAGES[_N].length > getCellNum(_X,_Y)) {
		e.preventDefault();
		menufillUp.hidden = false;
	}
});

n3conPages.addEventListener('click', e => {
	e.preventDefault();
	const listC = e.target.classList;
	if (listC[0] === 'nav-btn' && listC[1] !== 'curr') {
		const i = parseInt(e.target.textContent) - 1;
		for (const btn of e.target.parentNode.children)
			btn.classList.remove('curr');
		drawIcons(PAGES[( _N = i )], true);
		listC.add('curr');
	}
});

for(let i = 0, Word = ['Apply', 'Save', 'Copy', 'Remove']; i < 4; i++) {
	menufillUp.firstElementChild.children[i].textContent = i18n.getMessage(`db${Word[i]}`);
}

n3consView.addEventListener('mousemove', ({ clientX, clientY }) => {
	let { left, top } = n3consView.getBoundingClientRect(),
		x = Math.floor((clientX - left) / (Q_HEIGHT + R_MARGIN)),
		y = Math.floor((clientY - top) / (Q_HEIGHT + R_MARGIN));
	if (x <= Q_HEIGHT && y <= Q_HEIGHT) {
		n3conSel.style.left = `${(_X = calcBounds(x)) + left - 1}px`;
		n3conSel.style.top = `${(_Y = calcBounds(y)) + top - 1}px`;
	}
});

runtime.getBackgroundPage(({ kon3ktDB, sendDataTo }) => {

	kon3ktDB().then(db => {
		const tr = db.transaction(['n3cons'], 'readonly');
		const n3cons = tr.objectStore('n3cons').getAll();
		n3cons.onerror = () => console.error(n3cons.error)
		n3cons.onsuccess = ({ target: { result } }) => {

			const MAX_SELS = MAX_ROWS * MAX_COLS;

			for (let i = 1, s = 0; s < result.length; s += MAX_SELS, i++) {
				PAGES.push(
					result.slice(s, s + MAX_SELS)
				);
				const nav_el = n3conPages.appendChild(
					document.createElement('span')
				);
				nav_el.textContent = i;
				nav_el.className   = 'nav-btn';
			}
			n3conPages.hidden = result.length <= MAX_SELS;
			if (result.length) {
				n3conPages.children[0].classList.add('curr');
				drawIcons(PAGES[0], false);
			}
		};
	});

	menufillUp.addEventListener('click', e => {
		e.preventDefault();
		const [first, last] = menufillUp.children;
		switch (e.target.id) {
			case "apply_4_tab":
				tabs.query({ active: true }, ([tab]) => {
					sendDataTo(tab.id, getDataUrl());
				});
				break;
			case "save_to_pc":
				var a = document.createElement('a');
				a.download = 'n3con.png';
				a.href = getDataUrl();
				a.click();
				break;
			case "copy_to_clip":
				first.classList.add('hide');
				last.className = 'centered m-clip';
				last.children[0].textContent = getDataUrl();
				last.setAttribute('_MSG_', i18n.getMessage('dbCopyTextMSG'));
				last.onclick = e => {
					e.stopPropagation();
					e.preventDefault();
					if (e.target === last.children[0]) {
						selectText(e.target);
					}
				}
				break;
			case "remove_from_db":
				first.classList.add('hide');
				last.classList.remove('hide');
				last.children[0].textContent = i18n.getMessage('dbRemove') +'?';
				last.children[1].textContent = i18n.getMessage('dbYes');
				last.children[2].textContent = i18n.getMessage('dbNo');
				last.onclick = e => {
					if (e.target === last.children[1]) {
						const connectDB  = kon3ktDB();
						const [{ hash }] = PAGES[_N].splice(getCellNum(_X,_Y), 1);
						connectDB.then(db => {
							const tr = db.transaction(['n3cons'], 'readwrite');
							/*------*/ tr.objectStore( 'n3cons' ).delete( hash );
							drawIcons(PAGES[_N], true);
						});
					} else if (e.target != last.children[2]) {
						e.stopPropagation();
						e.preventDefault();
					}
				}
				break;
			default:
				first.classList.remove('hide');
				last.className    = 'centered hide';
				last.onclick      = null;
				menufillUp.hidden = true;
		}
	});
});

function drawIcons(icons, clear = false) {

	const context2D = n3consView.getContext('2d');

	if (clear)
		context2D.clearRect(0, 0, n3consView.width, n3consView.height);

	for (let i = 0, y = 0; y < MAX_ROWS && i < icons.length; y++) {

		for (let x = 0; x < MAX_COLS && i < icons.length; i++, x++) {

			const { hash, pixelData } = icons[i];

			if ( !hash )
				continue;

			context2D.putImageData(
				new ImageData(pixelData, Q_HEIGHT, Q_HEIGHT),
				calcBounds(x),
				calcBounds(y)
			);
		}
	}
}

function getDataUrl(blob = false) {
	const { pixelData } = PAGES[_N][ getCellNum(_X,_Y) ];
	const oCanv = document.createElement('canvas');
	oCanv.width = oCanv.height = Q_HEIGHT;
	oCanv.getContext('2d').putImageData(
		new ImageData(pixelData, Q_HEIGHT, Q_HEIGHT), 0, 0);
	return blob ? URL.createObjectURL(oCanv.toBlob()) : oCanv.toDataURL();
}

function selectText(el) {
	const range = document.createRange();
	range.selectNode(el);
	window.getSelection().addRange(range);
}
