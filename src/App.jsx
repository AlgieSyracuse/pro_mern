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
import { Switch, Redirect, HashRouter as Router, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';


const NoMatch = () => <p> Page Not Found </p>;
const contentNode = document.getElementById('contents');

// frame with header, footer

const App = () => (
  <div>
    <div className="header">
      <h1>Issue Tracker</h1>
    </div>
    <div className="contents">
      <Router>
        <Switch>
          <Route path="/issues/:id" component={IssueEdit} />
          <Route path="/issues" component={IssueList} />
          <Route exact path="/" component={IssueList} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </Router>
    </div>
    <div className="footer">
      Full source code available at this
      <a href="https://github.com/vasansr/pro-mern-stack">
      GitHub repository
      </a>.
    </div>
  </div>
);


// using HashRouter, only for legacy, recommending BrowserRouter,
// <Switch> must be used in new version
// withRouter to pass the HashRouter to IssueList also, it wil use {path, search} inside
// nested routers, children routers use relative path to parent's

/* not works for v4
const RoutedApp = () => (
  <Router history={hashHistory} >
    <Redirect from="/" to="/issues" />
    <Route path="/" component={App} >
      <Route path="issues" component={withRouter(IssueList)} />
      <Route path="issues/:id" component={IssueEdit} />
      <Route path="*" component={NoMatch} />
    </Route>
  </Router>
);
*/


ReactDOM.render(<App />, contentNode); // Render RoutedApp component

// -- < deprecated > --
// ReactDOM.render(<IssueList />, contentNode); // Render the component inside the content Node

// hot increasing replace of app.bundle.js

if (module.hot) {
  module.hot.accept();
}
