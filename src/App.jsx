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
import { Switch, Redirect, HashRouter, Route, withRouter } from 'react-router-dom';

import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p> Page Not Found </p>;

// using HashRouter, only for legacy, recommending BrowserRouter,
// <Switch> must be used in new version
// withRouter to pass the HashRouter to IssueList also, it wil use {path, search} inside
const RoutedApp = () => (
  <HashRouter>
    <Switch>
      <Redirect exact from="/" to="/issues" />
      <Route path="/issues/:id" component={IssueEdit} />
      <Route path="/issues" component={withRouter(IssueList)} />
      <Route path="*" component={NoMatch} />
    </Switch>
  </HashRouter>
);

ReactDOM.render(<RoutedApp />, contentNode); // Render RoutedApp component

// -- < deprecated > --
// ReactDOM.render(<IssueList />, contentNode); // Render the component inside the content Node

// hot increasing replace of app.bundle.js

if (module.hot) {
  module.hot.accept();
}
