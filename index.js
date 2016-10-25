'use strict';

const id3 = require('./app/src/id3');

var tags = id3.read('./sample/Miracles.mp3');

console.log(tags);
