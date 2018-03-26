#!/bin/bash

# Requirements
# uglifyjs - https://github.com/mishoo/UglifyJS2
# minify - https://github.com/tdewolff/minify/tree/master/cmd/minify
# tidy-html5 v5.7.3 - https://github.com/htacg/tidy-html5 

MINIFY=1
TIDY=1
OPEN_LOG=1
LOG_FILE='build.log'
TEMP_FILE="/tmp/$LOG_FILE"

if [ "$MINIFY" -eq 1 ]; then
  js='_includes/scripts'
  libraries='_includes/libraries'
  echo 'Uglifying javascripts...'
  uglifyjs -m reserved $js/nquery.js $js/shared.js > $js/main.min.js
  uglifyjs -m reserved $js/contact.js > $js/contact.min.js
  uglifyjs -m reserved $libraries/typed.min.js $js/index.js > $js/index.min.js
  uglifyjs -m reserved $js/i13n.js > $js/i13n.min.js
fi

JEKYLL_ENV=production bundle exec jekyll build --verbose --strict_front_matter

if [ "$?" -eq 0 ] && [ "$MINIFY" -eq 1 ]; then
  assets='_site/assets'
  echo 'Minifying CSS assets...'
  minify --type=css $assets/normalize.css $assets/main.css > $assets/main.min.css

  # remove originals that were generated in _site
  if [ "$?" -eq 0 ]; then
    echo 'Minified CSS assets.'
    rm $assets/normalize.css $assets/main.css
  fi
fi

# Tidy up the generated html file and print results to a log file
if [ "$TIDY" -eq 1 ]; then
  echo 'Tidying up generated HTML files.'
  cp "$LOG_FILE" "$TEMP_FILE"

  find _site -name '*.html' -exec bash -c 'file="$0"; echo "------------Tidying $file-------------"; tidy --merge-divs no --merge-spans no --enclose-block-text no --enclose-text no --coerce-endtags no --hide-comments yes --wrap 0 --tidy-mark no --drop-empty-elements no --drop-empty-paras no -indent -modify "$file" 2>&1 | grep -E "Warning:|Error:|Tidy found|No warnings or errors"; echo ""' {} \; > "$LOG_FILE"

  # do a diff, if build log is same as previous, don't bother opening log file for review.
  diff "$LOG_FILE" "$TEMP_FILE" > /dev/null
  diff_result="$?" # 0=no diff, 1=has diff

  if [ "$OPEN_LOG" -eq 1 ] && [ "$diff_result" -ne 0 ]; then
    echo "$LOG_FILE unchanged, please review."
    less "$LOG_FILE"
  elif [ "$OPEN_LOG" -eq 1 ] && [ "$diff_result" -eq 0 ]; then
    echo "$LOG_FILE is unchanged, ignoring."
  fi
fi


echo 'Cleaning up...'
rm $js/*.min.js
