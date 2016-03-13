
(function($t) {
	var hed = document.getElementsByTagName('head')[0],
		fav = hed.querySelectorAll('link[rel$="icon"], link[rel="icon"]');
	for (var i = 0; i < fav.length; i++) {
		if (i + 1 === fav.length)
			defaultSet(fav[i].href);
		hed.removeChild(fav[i]);
	}
	hed.appendChild($t.link);
})(Favnekon);