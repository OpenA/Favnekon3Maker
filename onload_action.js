(function($t) {
	var hed = document.getElementsByTagName('head')[0],
		fav = hed.querySelectorAll('link[rel$="icon"], link[rel="icon"]'),
		 i  = fav.length - 1;
	if ( i >= 0) {
		if (!Favnekon.apply)
			Favnekon.link.href = fav[0].href;
		defavult.src = fav[0].href;
	}
	for (; i >= 0; i--) {
		hed.removeChild(fav[i]);
	}
	hed.appendChild($t.link);
})(Favnekon);
