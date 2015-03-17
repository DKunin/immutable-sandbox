'use strict';

var events           = require('events');  
var eventEmitter     = new events.EventEmitter();
eventEmitter.off     = eventEmitter.removeListener;
eventEmitter.trigger = eventEmitter.emit;


module.exports = eventEmitter;