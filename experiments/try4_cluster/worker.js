#!/usr/bin/node

var uglify = require( 'uglify-js' );
var fs = require('fs');

var id = process.argv[2];

console.log( 'worker' + id + ' started' );

process.send({ message: 'give_me_another' });

// node note: process.send sends to the master process, if we're spawned as a
// worker with an IPC channel.

process.on('message', function(msg) {
    //console.log('worker' + id + ': got command ' + msg.cmd);
    if ( 'go' == msg.cmd ) {
        console.log( 'worker' + id + ': processing ' + msg.name );
        uglify_it( msg.name );
    } else console.log( 'worker' + id + ': received unknown command: ' + msg.cmd);
});

process.on('exit', function(err) {
    console.log( 'worker' + id + ': I am Exiting' );
});

function uglify_it( fname ) {
    try {
        code = uglify.minify( fname ).code;
    } catch (error) {
        console.log(error);
        return;
    }

    // write the code back to the file
    fs.writeFile(fname, code, function(error) {
        if (error) {
            console.log(error);
            return;
        }
        console.log( 'worker' + id + ': Uglified ' + fname );
        process.send({ message: 'give_me_another' });
    });
}
