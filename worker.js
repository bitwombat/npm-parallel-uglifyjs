#!/usr/bin/node

var job = require( './uglify-single.js' ).uglify;

var id = process.argv[2];

console.log( 'worker' + id + ' started' );

// Get things started
process.send({ message: 'give_me_another' });

// node note: process.send sends to the master process if we were forked by
// child_process (we have an IPC channel)

process.on( 'message', function( msg ) {
    if ( 'go' == msg.cmd ) {
        console.log( 'worker' + id + ': processing ' + msg.name );
        job( msg.name, function () {
            console.log( 'worker' + id + ': Done ' );
            process.send({ message: 'give_me_another' });
        });
    } else
        console.log( 'worker' + id + ': received unknown command: ' + msg.cmd );
});

process.on( 'exit', function( err ) {
    console.log( 'worker' + id + ': I am exiting' );
});

