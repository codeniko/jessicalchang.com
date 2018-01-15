#!/bin/bash

# Requirements
# uglifyjs - https://github.com/mishoo/UglifyJS2
# minify - https://github.com/tdewolff/minify/tree/master/cmd/minify

minify=1

if [ $minify -eq 1 ]; then
  js='_includes/scripts'
  echo 'Uglifying javascripts...'
  uglifyjs -m reserved $js/nquery.js $js/shared.js > $js/main.min.js
  uglifyjs -m reserved $js/contact.js > $js/contact.min.js
  uglifyjs -m reserved $js/index.js > $js/index.min.js
fi

JEKYLL_ENV=production bundle exec jekyll build --verbose --strict_front_matter

if [ $? -eq 0 ] && [ $minify -eq 1 ]; then
  assets='_site/assets'
  echo 'Minifying CSS assets...'
  minify --type=css $assets/normalize.css $assets/main.css > $assets/main.min.css

  # remove originals that were generated in _site
  if [ $? -eq 0 ]; then
    echo 'Minified CSS assets.'
    rm $assets/normalize.css $assets/main.css
  fi

fi

echo 'Cleaning up...'
rm $js/*.min.js
