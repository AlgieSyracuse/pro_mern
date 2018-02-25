/*
  any modification of jsx in this foler can be watched by "npm run watch"
  all jsx -> app.bundle.js.

  webpack watch any diff in jsx, via babel cli in "webpack.config.js"
  if diff, webpack's babel loader will automatic compile jsx -> js

*/

/* npm install --save-dev react react-dom whatwg-fetch babel-polyfill
  that is, no need CDN lib in html, since we have downloaded them to local
*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import IssueList from './IssueList.jsx';

const contentNode = document.getElementById('contents');

ReactDOM.render(<IssueList />, contentNode); // Render the component inside the content Node

// hot increasing replace of app.bundle.js
if (module.hot) {
  module.hot.accept();
}
