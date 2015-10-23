#!/usr/bin/node

var id = process.argv[2];

console.log( 'worker' + id + ' started' );

process.send({ message: 'give_me_another' });

// node note: process.send sends to the master process, if we're spawned as a
// worker with an IPC channel.

process.on('message', function(m) {
    //console.log('worker' + id + ': got command ' + m.cmd);
    if ( 'go' == m.cmd ) {
        console.log( 'worker' + id + ': processing ' + m.name );
        setTimeout(function() {
            console.log( 'worker' + id + ': I am done' );
            process.send({ message: 'give_me_another' });
            }, 500);
    } else console.log( 'worker' + id + ': received unknown command: ' + m.cmd);
});

process.on('exit', function(err) {
    console.log( 'worker' + id + ': I am Exiting' );
});
