'use strict';

/* any modification in this file can be watched by "npm run watch" */

var contentNode = document.getElementById('contents');
//var component = <h1>Hello World, I am back!</h1>;        // A simple component, written in JSX

var continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
var message = continents.map(function (c) {
  return 'Hello ' + c + '!';
}).join(' ');

var component = React.createElement(
  'p',
  null,
  message
); // A simple component, written in JSX
ReactDOM.render(component, contentNode); // Render the component inside the content Node