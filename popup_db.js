
const Q_HEIGHT = 32;
const R_MARGIN = 8;

const calcBounds = num => Q_HEIGHT * num + R_MARGIN * num;
const n3conSel   = document.getElementById('n3cons_sel');
const menufillUp = document.getElementById('menu_fill_up');
const n3consView = document.getElementById('n3cons_view'),
      context2D  = n3consView.getContext('2d');

const MAX_COLS = 5;
const MAX_ROWS = 8;

n3consView.width  = calcBounds(MAX_COLS); // columns
n3consView.height = calcBounds(MAX_ROWS); // rows

let _X = -1, _Y = -1, iData = null;

n3conSel.addEventListener('mousedown', e => {
	if (e.button === 0) {
		e.preventDefault();
		iData = context2D.getImageData(_X, _Y, Q_HEIGHT, Q_HEIGHT);
		menufillUp.hidden = false;
	}
});

for(let i = 0, Word = ['Apply', 'Save', 'Copy', 'Remove']; i < 4; i++) {
	menufillUp.firstElementChild.children[i].textContent = browser.i18n.getMessage(`db${Word[i]}`);
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

browser.runtime.getBackgroundPage(({ kon3ktDB, sendDataTo }) => {

	const fillN3cons = db => {
		const tr = db.transaction(['n3cons'], 'readonly');
		const n3cons = tr.objectStore('n3cons').getAll();
		n3cons.onerror = () => console.error(n3cons.error)
		n3cons.onsuccess = ({ target: { result } }) => {
			let i = 0, p = 0;
			for (let y = 0; y < MAX_ROWS && i < result.length; i++, y++) {
				for (let x = 0; x < MAX_COLS && i < result.length; i++, x++) {
					const { hash, pixelData } = result[i];
					if ( !hash )
						continue;
					context2D.putImageData(
						new ImageData(pixelData, Q_HEIGHT, Q_HEIGHT),
						calcBounds(x),
						calcBounds(y)
					);
				}
			}
		};
	}
	kon3ktDB().then(fillN3cons);

	menufillUp.addEventListener('click', e => {
		e.preventDefault();
		const [first, last] = menufillUp.children;
		switch (e.target.id) {
			case "apply_4_tab":
				browser.tabs.query({ active: true }, ([tab]) => {
					sendDataTo(tab.id, getDataUrl());
				});
				break;
			case "save_to_pc":
				var a = document.createElement('a');
				a.download = 'favicon.png';
				a.href = getDataUrl();
				a.click();
				break;
			case "copy_to_clip":
				first.classList.add('hide');
				last.className = 'centered m-clip';
				last.children[0].textContent = getDataUrl();
				last.setAttribute('_MSG_', 'click text and use copy from context menu');
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
				last.children[0].textContent = browser.i18n.getMessage('dbRemove') +'?';
				last.children[1].textContent = browser.i18n.getMessage('dbYes');
				last.children[2].textContent = browser.i18n.getMessage('dbNo');
				last.onclick = e => {
					if (e.target === last.children[1]) {
						let hash = 0, connectDB = kon3ktDB();
						for (let byte of iData.data)
							hash += byte;
						context2D.clearRect(0, 0, n3consView.width, n3consView.height);
						connectDB.then(db => {
							const tr = db.transaction(['n3cons'], 'readwrite');
							/*------*/ tr.objectStore( 'n3cons' ).delete( hash );
							fillN3cons(db);
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

function getDataUrl(blob = false) {
	const oCanv = document.createElement('canvas');
	oCanv.width = oCanv.height = Q_HEIGHT;
	oCanv.getContext('2d').putImageData(iData, 0, 0);
	return blob ? URL.createObjectURL(oCanv.toBlob()) : oCanv.toDataURL();
}

function selectText(el) {
	const range = document.createRange();
	range.selectNode(el);
	window.getSelection().addRange(range);
}
