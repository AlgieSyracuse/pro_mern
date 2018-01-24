/* any modification in this file can be watched by "npm run watch" */

var contentNode = document.getElementById('contents');
//var component = <h1>Hello World, I am back!</h1>;        // A simple component, written in JSX

const continents = ['Africa','America','Asia','Australia','Europe'];
const message = continents.map(c => `Hello ${c}!`).join(' ');

const component = <p>{message}</p>;           // A simple component, written in JSX
ReactDOM.render(component, contentNode);      // Render the component inside the content Node