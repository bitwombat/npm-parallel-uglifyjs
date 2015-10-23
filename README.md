
# parallel-uglifyjs
Hunts for js files in a directory tree, and runs uglify-js on them in parallel
(one per CPU).

Easily modifiable to run any job in parallel (see worker.js).

On my machine a large test takes 2.5 hours utilising a single CPU, and 20
minutes with parallel-uglifyjs.

## Installation

    $ npm install parallel-uglifyjs

## Usage
    $ ./parallel_uglifyjs small_test

## Developers
### To set up a set of test files:
(a dumb, time-consuming way of doing it, but it should be a once-off)

    $ svn export /www/uf/uf_checkout/trunk/resource/content/big_test big_test
    $ find big_test \! -name '*.js' -a \! -name '*.css' -type f -exec rm {} \;
    $ cp -prv big_test big_test.virgin

## Help
I'm pretty sure the npm packaging is wrong (I should have a bin and lib
dir at least).  Please raise an issue, or fork and issue a pull request if you
can critique.

Also on an Ubuntu 14.04 LTS machine (kernel version 3.13), the workers seem to
get sent 10 or so jobs at a time by master.js.  I'm not sure why this is.  Does
the kernel limit the number of open file handles per process so something small?
