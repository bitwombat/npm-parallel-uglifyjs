#!/usr/bin/env node

var cp = require( 'child_process' );
var finder = require( 'finder-on-steroids' );

var numCPUs = require( 'os' ).cpus().length;

var util = require( 'util' );

if (process.argv.length != 3) {
	console.error('Please enter a (single) directory of scripts to uglify.');
	process.exit(1);
}

console.log( 'Finding files' );
finder(process.argv[2]).files().name( '*.js' ).find(launch);

function launch(err, files) {
    if ( err != null ) {
	    console.error(err);
    }

    // Fork all workers
    var workers = []

    for ( i = 0; i < numCPUs; i++ ) {

        worker = cp.fork( __dirname + '/../worker.js', [i] );

        worker.on( 'message', make_message_processor(i) );

        worker.on('error', function( err ) {
            console.error( 'Worker: Something bad happened: ' + err );
        });

        workers.push( worker );

    }


    // Give out jobs

    var job = 0;

    function next( worker_id ) {
        job++;
        worker_process = workers[ worker_id] ;
        if ( job < files.length ) {
            percentage = Math.trunc(100 * job/(files.length-1));
            process.stdout.write(util.format("%d of %d [%d%%]: %s\r", job, files.length-1, percentage, files[job]));
            worker_process.send({ cmd: 'go', name: files[job] });
        } else {
            console.log( 'master: We are all done.  Disconnecting ' + worker_id + '.');
            worker_process.disconnect();
        }
    }

    // Create message processing function for each worker
    function make_message_processor( id ) {

        var local_id = id;  // this gets closed

        return function ( msg ) {
            //console.log('master: got message:', msg.message);
            switch ( msg.message ) {
                case 'give_me_another':
                    next( local_id );
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
}

// Respond to other messages
process.on( 'error', function( err ) {
    console.log( 'master: Something bad happened: ' + err );
});

process.on('exit', function( err ) {
    console.log( 'master: Exiting' );
});
