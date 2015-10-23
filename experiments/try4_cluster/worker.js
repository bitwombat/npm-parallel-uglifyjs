#!/usr/bin/node

var job = require('./uglify-single.js').uglify;

var id = process.argv[2];

console.log( 'worker' + id + ' started' );

process.send({ message: 'give_me_another' });

// node note: process.send sends to the master process, if we're spawned as a
// worker with an IPC channel.

process.on('message', function(msg) {
    //console.log('worker' + id + ': got command ' + msg.cmd);
    if ( 'go' == msg.cmd ) {
        console.log( 'worker' + id + ': processing ' + msg.name );
        job( msg.name, function () {
            console.log( 'worker' + id + ': Done ' );
            process.send({ message: 'give_me_another' });
        });
    } else console.log( 'worker' + id + ': received unknown command: ' + msg.cmd);
});

process.on('exit', function(err) {
    console.log( 'worker' + id + ': I am Exiting' );
});

