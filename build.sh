#!/bin/bash

# Requirements
# uglifyjs - https://github.com/mishoo/UglifyJS2
# minify - https://github.com/tdewolff/minify/tree/master/cmd/minify
# tidy-html5 v5.7.3 - https://github.com/htacg/tidy-html5 

minify=1
tidy=1

if [ $minify -eq 1 ]; then
  js='_includes/scripts'
  libraries='_includes/libraries'
  echo 'Uglifying javascripts...'
  uglifyjs -m reserved $js/nquery.js $js/shared.js > $js/main.min.js
  uglifyjs -m reserved $js/contact.js > $js/contact.min.js
  uglifyjs -m reserved $libraries/typed.min.js $js/index.js > $js/index.min.js
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

# Tidy up the generated html file and print results to a log file
if [ $tidy -eq 1 ]; then
  echo 'Tidying up generated HTML files.'
  find _site -name '*.html' -exec bash -c 'file="$0"; echo "------------Tidying $file-------------"; tidy --merge-divs no --merge-spans no --enclose-block-text no --enclose-text no --coerce-endtags no --hide-comments yes --wrap 0 --tidy-mark no --drop-empty-elements no --drop-empty-paras no -indent -modify "$file" 2>&1 | grep -E "Warning:|Error:|Tidy found|No warnings or errors"; echo ""' {} \; > build.log
fi


echo 'Cleaning up...'
rm $js/*.min.js
