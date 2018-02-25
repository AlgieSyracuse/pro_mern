/*
    create a seperate entry point, load the babel-register module and server.js,
    alternative restart node when any change in server.js

    depdend: npm install --save-dev babel-register
 */

require('babel-register')({
  presets: ['es2015-node'],
});

require('./server.js');
