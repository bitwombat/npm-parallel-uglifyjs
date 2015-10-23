#!/usr/bin/node

var cp = require('child_process');

var numCPUs = require('os').cpus().length;


// Fork all workers
var workers = []

for ( i = 0; i < numCPUs; i++ ) {
    worker = cp.fork(__dirname + '/worker.js', [i]);
    worker.on( 'message', make_message_processor(i) );
    worker.on('error', function(err) {
        console.log( 'Worker: Something bad happened: ' + err );
    });

    workers.push( worker );
}


// Hand out jobs
var job = 0;

function next(worker_id) {
    job++;
    worker_process = workers[worker_id];
    if ( job < 10 ) {
        console.log( 'master: Sending job ' + job + ' to worker ' + worker_id );
        worker_process.send({ cmd: 'go', name: job });
    } else {
        console.log( 'master: we are all done.  Kill ' + worker_id );
        worker_process.disconnect();
    }
}

// Create message processing function for each worker
function make_message_processor (id) {

    var local_id = id;  // this gets closed

    return function (msg) {
        //console.log('master: got message:', msg.message);
        switch (msg.message) {
            case 'give_me_another':
                console.log( 'master: ' + local_id + ' has asked for another job.' );
                next(local_id);
                break;
            case 'error':
                console.log( 'master: got error from worker process' );
                break;
            case 'default':
                console.log( 'master: got unknown message' );
                break;
        }
    }
}

// Respond to other messages
process.on('error', function(err) {
    console.log( 'master: Something bad happened: ' + err );
});

process.on('exit', function(err) {
    console.log( 'master: Exiting' );
});
