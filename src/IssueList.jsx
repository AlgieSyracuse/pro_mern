// @ts-nocheck
import React from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import IssueAdd from './IssueAdd.jsx';
import IssueFilter from './IssueFilter.jsx';


// if a component has nothing but a render, it is recommended to
// written as function, for performance reason, [from book: stateless component]
const IssueRow = props => (
  <tr>
    <td><Link to={`/issues/${props.issue._id}`}> {props.issue._id.substr(-4)} </Link></td>
    <td>{props.issue.status}</td>
    <td>{props.issue.owner}</td>
    <td>{props.issue.created.toDateString()}</td>
    <td>{props.issue.effort}</td>
    <td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
    <td>{props.issue.title}</td>
  </tr>
);

  // also a stateless component
function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    (<IssueRow key={issue._id} issue={issue} />));
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
}


export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    // console.log('loading data after component mount\n');
    this.loadData();
  }

  // whenever any property of the component changes, eg location.search
  componentDidUpdate(prevProps) {
    const oldSearch = prevProps.location.search;
    const newSearch = this.props.location.search;
    if (oldSearch === newSearch) return;
    this.loadData();
  }

  loadData() {
    // using GET /api/issues to retrieve all list data
    fetch(`/api/issues${this.props.location.search}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          // console.log('Total count of records: ', data._metadata.total_count);
          data.records.forEach((issue) => {
            issue.created = new Date(issue.created); // string => date
            if (issue.completionDate) issue.completionDate = new Date(issue.completionDate);
          });
          this.setState({ issues: data.records });
        });
      } else {
        response.json().then((error) => {
          alert(`Failed to fetch issues from mongo: ${error.message}`);
        });
      }
    }).catch((err) => {
      alert('Error in fetching data from server: ', err);
    });
  }

  createIssue(newIssue) {
    // create, then POST to the  newIssue to server
    fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((updatedIssue) => {
            updatedIssue.created = new Date(updatedIssue.created);
            if (updatedIssue.completionDate) {
              updatedIssue.completionDate = new Date(updatedIssue.completionDate);
            }
            const newIssues = this.state.issues.concat(updatedIssue);
            this.setState({ issues: newIssues });
          });
        } else {
          response.json().then((error) => {
            alert(`Failed to add issue: ${error.message}`);
          });
        }
      })
      .catch((err) => {
        alert(`Error in sending data to server: ${err.message}`);
      });
  }

  render() {
    return (
      <div>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </div>
    );
  }
}

IssueList.propTypes = {
  location: PropTypes.isRequired, // new standard usage
};
