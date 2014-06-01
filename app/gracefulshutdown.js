
var _ = require('underscore');

var callbacks = [];

var SECOND_WAIT = 2;

var addShutdownCallback = function(callback) {
    callbacks.push(callback);
};

var logError = function(err) {

    if (err) {
        console.log(err);
        console.log(err.stack);
    }
};


var shuttingdown = false;

var gracefulShutdown = function() {

    if (shuttingdown) {
        console.log("Blergh, already shutting down. Not shutting down twice");
        return;
    }
    shuttingdown = true;
    console.log("Received kill signal, shutting down gracefully.");
    console.error("Executing callbacks, closing after " + SECOND_WAIT + " seconds");

    _.each(callbacks, function(callback) {
        callback();
    });

    setTimeout(function() {
       console.error("Exiting");
       process.exit();
    }, SECOND_WAIT * 1000);

};


process.on('SIGINT', function() {
  console.log('Got SIGINT.');
  gracefulShutdown();
});

process.on('SIGTERM', function() {
  console.log('Got SIGTERM.');
  gracefulShutdown();
});


module.exports.addShutdownCallback = addShutdownCallback;
module.exports.gracefulShutdown = gracefulShutdown;
