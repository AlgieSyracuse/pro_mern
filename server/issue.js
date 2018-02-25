// 'use strict'  deprecated in ES2015

// posted data validation
const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true,
};

const issueFieldType = {
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required',
};

// now cleanup + validate
function validateIssue(issue) {
  const errors = [];
  Object.keys(issueFieldType).forEach((field) => {
    if (issueFieldType[field] === 'required' && !issue[field]) {
      errors.push(`Missing mandatory field: ${field}`);
    }
  });
  if (issue.status && !validIssueStatus[issue.status]) {
    errors.push(`${issue.status} is not a valid status.`);
  }
  return errors.length ? errors.join(';') : null;
}

module.exports = {
  validateIssue,
};
