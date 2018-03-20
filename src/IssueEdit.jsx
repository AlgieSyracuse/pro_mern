import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class IssueEdit extends React.Component { // eslint-disable-line
  render() {
    return (
      <div>
        <p> This is a placeholder for Issue Edit page, id = {this.props.match.params.id}. </p>
        <Link to="/issues"> Back to issue list </Link>
      </div>
    );
  }
}

IssueEdit.propTypes = {
  params: PropTypes.object.isRequired, // new standard usage
};
