#!/bin/sh

SRC=" \
_locales/*/* \
tools/*/* \
tools/*/*/* \
popup_db.js  content_styles.css background.js \
popup_db.html content_script.js"

EXC="\
tools/draww/pasL/README.md \
tools/draww/js/kanako-input.js \
tools/draww/css/kanako.css \
tools/draww/README.md \
tools/draww/kana-text.html"

ARC="dist/Favnekon3Maker.zip"
VER="2"
INF="chrome"

for i in "$@"; do
  case $i in
    --help | -h)
      echo ""
      echo " build-ext.sh [option]\n"
      echo "    -v3    Manifest V3 "
      echo "    -g3    Manifest V3 (gecko)"
      echo "    -v2    Manifest V2 (default)"
      echo ""
      exit
      ;;
    -g3)
      INF="gecko"
      ;;
    -v3)
      VER="3"
      ;;
    *)
      # unknown option
      ;;
  esac
done

mkdir -p dist
echo "\nbuilding:\033[0;9$VER;49m WebExt Manifest V$VER ($INF)\033[0m"

if  which ffmpeg; then
  ffmpeg -i 'icons/n3k-large.svg' -s '128x128' -y 'icons/n3k@128.png'
  ffmpeg -i 'icons/n3k-small.svg' -s  '64x64'  -y 'icons/n3k@64.png'
  SRC="$SRC icons/n3k@128.png icons/n3k@64.png"
elif which magic; then
  magic 'icons/n3k-large.svg' -scale '128x128' 'icons/n3k@128.png'
  magic 'icons/n3k-small.svg' -scale  '64x64'  'icons/n3k@64.png'
  SRC="$SRC icons/n3k@128.png icons/n3k@64.png"
fi

if [ "$VER" = "2" ]; then
  sed -e 's/"manifest_version":.*3/"manifest_version": 2/' \
      -e 's/"service_worker":.*"background.js"/"scripts": ["background.js"]/' \
      -e 's/{"resources": \[//' -e 's/\], "matches": \["<all_urls>"\]}//'\
      -e 's/"action"/"browser_action"/' \
      -e 's/"host_permissions":.*\["<all_urls>"\]\,//' \
      -e 's/"scripting"/"<all_urls>"/' \
      manifest.json > dist/manifest.json
  zip -9 -jm $ARC dist/manifest.json

elif [ "$INF" = "gecko" ]; then
  sed -e 's/"service_worker":.*"background.js"/"scripts": ["background.js"]/' \
      -e 's/"action"/"browser_specific_settings": {"gecko": {"id": "'$UID'","strict_min_version": "109.0"}},\n	"action"/' \
      manifest.json > dist/manifest.json
  zip -9 -jm $ARC dist/manifest.json
else
  SRC="manifest.json $SRC"
fi

zip -9 -T $ARC $SRC -x $EXC @
