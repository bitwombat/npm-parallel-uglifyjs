
# parallel-uglifyjs
Hunts for js files in a directory tree, and runs uglify-js on them in parallel
(one per CPU).

Based heavily on [https://github.com/digitaledgeit/npm-recursive-uglifyjs](recursive-uglifyjs)

## Installation

    $ npm install -g recursive-uglifyjs

## Usage
    $ ./uglify_js_parallel small_test

### Run single instance (for testing)
    $ ./uglify_js_single big_test/titles/advent-and-christmas/03/04/activity/02/story_content/frame.js

## Developers
### To set up a set of test files:
(a dumb, time-consuming way of doing it, but it should be a once-off)
    $ svn export /www/uf/uf_checkout/trunk/resource/content/big_test big_test
    $ find big_test \! -name '*.js' -a \! -name '*.css' -type f -exec rm {} \;
    $ cp -prv big_test big_test.virgin

