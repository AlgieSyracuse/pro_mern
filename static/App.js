/* any modification in this file can be watched by "npm run watch" */

var contentNode = document.getElementById('contents');
var component = React.createElement(
  'h1',
  null,
  'Hello World, I am back!'
); // A simple component, written in JSX
ReactDOM.render(component, contentNode); // Render the component inside the content Node