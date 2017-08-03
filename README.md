
# parallel-uglifyjs
Hunts for js files in a directory tree, and runs uglify-js on them in parallel
(one per CPU).

Easily modifiable to run any job in parallel (see worker.js).

On an 8-core machine a large test takes 2.5 hours utilising a single CPU, and
20 minutes with parallel-uglifyjs.

## Installation

    $ npm install parallel-uglifyjs

## Usage
    $ ./parallel_uglifyjs small_test
