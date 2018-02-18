/*
    any change in this code will result in nodejs restart, via package "nodemon", 
    referring to "npm start" script -> start: "nodemon -w server.js server.js"
*/

'use strict'

const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const mongoClient = require('mongodb').MongoClient;

// middlewares to use
  // express built-in middleware
app.use(express.static('static'));
  // body-parser module, parse HTTP body
app.use(bodyParser.json());


// route matching by Express, only matching http GET request
/*
app.get('/api/issues', (req, res)=>{
    const metadata = {total_count: issues.length};
    res.json({_metadata: metadata, records: issues}); // client: curl -s URL | json_pp
    //res.send('Hello World!\n');
});
*/
app.get('/api/issues', (req, res) => {
    db.collection('issues').find().toArray().then(issues => {
        // if returned array is big, use find().limit(100) or skip(), or toArray().forEach or stream
        const metadata = {total_count: issues.length};
        res.json( { _metadata: metadata, records: issues} );
    }).catch(err => {
        console.log(err);
        res.status(500).json( { message: `Internal Server Error: ${err}`} );
    });
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
    newIssue.created = new Date();
    if(!newIssue.status) newIssue.status = 'New';

    // handling err that parsed in input validatiion
    const err = validateIssue(newIssue);
    if(err) {
        res.status(422).json({message: `\ninvalid request: \n ${err}`}); // client will callback the message
        return;
    }

    // db... insert
    db.collection('issues').insertOne(newIssue).then( result => 
        db.collection('issues').find({_id: result.inertedId}).limit(1).next()
    ).then(() => {
        res.json(newIssue);
    }).catch( err => {
        console.log(err);
        res.status(500).json({message: `Internal Server Error: ${err}`});
    });
});


/*
app.listen(3000, function() {
    console.log("App started on port 3000");
});
*/

let db;

// note: it's differnt connection between MongoDB 3.x and MongoDB 2.x 
mongoClient.connect('mongodb://localhost:27017').then(clientDB => {
    db = clientDB.db('issuetracker'); // new from version 3.0
    app.listen(3000, () => {
        console.log('App started on port 3000');
    });
}).catch( err => {
    console.log('ERROR: ', err);
});