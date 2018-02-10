/*
    any change in this code will result in nodejs restart, via package "nodemon", 
    referring to "npm start" script -> start: "nodemon -w server.js server.js"
*/

const express = require("express");
const bodyParser = require('body-parser');
const app = express();

// middlewares to use
  // express built-in middleware
app.use(express.static('static'));
  // body-parser module, parse HTTP body
app.use(bodyParser.json());

// pretending data in server
const issues = [
    {
        id: 1, status: 'Open', owner: 'Raven',
        created: new Date(), effort: 5, completionDate: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2, status: 'Assigned', owner: 'Eddie',
        created: new Date('2017-07-11'), effort: 15,
        completionDate: new Date('2017-07-30'),
        title: 'Missing bottom border on panel'
    },
];

// route matching by Express, only matching http GET request
app.get('/api/issues', (req, res)=>{
    const metadata = {total_count: issues.length};
    res.json({_metadata: metadata, records: issues}); // client: curl -s URL | json_pp
    //res.send('Hello World!\n');
});


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
    id: 'required',
    status: 'required',
    owner: 'required',
    effort: 'optional',
    created: 'required',
    completionDate: 'optional',
    title: 'required',
};
  
function validateIssue(issue) {
    for (const field in issueFieldType) {
      const type = issueFieldType[field];
      if (!type) {
        delete issue[field];
      } else if (type === 'required' && !issue[field]) {
        return `${field} is required.`;
      }
    }
  
    if (!validIssueStatus[issue.status])
      return `${issue.status} is not a valid status.`;
  
    return null;
  }


// POST REST api
app.post('/api/issues', (req, res)=>{
    const newIssue = req.body;
    newIssue.id = issues.length+1;
    newIssue.created = new Date();
    if(!newIssue.status) newIssue.status = 'New';

    // handling err
    const err = validateIssue(newIssue);
    if(err) {
        res.status(422).json({message: `\ninvalid request: \n ${err}`}); // client will callback the message
        return;
    }

    issues.push(newIssue);
    res.json(newIssue); // return data newIssue to client
});



app.listen(3000, function() {
    console.log("App started on port 3000");
});