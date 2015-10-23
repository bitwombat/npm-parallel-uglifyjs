
var fs = require('fs');
var uglify = require( 'uglify-js' );

exports.uglify = function ( fname, cb ) {
    try {
        code = uglify.minify( fname ).code;
    } catch ( error ) {
        console.error( error );
        return;
    }

    // write the code back to the file
    fs.writeFile( fname, code, function( error ) {
        if ( error ) {
            console.error( error );
            return;
        }
        cb();
    });
}
