/*
    chap6
    any change in this code will result in nodejs restart, via package "nodemon",
    referring to "npm start" script -> start: "nodemon -w server.js server.js"

    -issue Chap7, Feb19, 18
        node doesn't fully support ES2015, e.g., import ... from
        need install "babel-preset-es2015-node" to enable ES2015 on server-side js
        also need include babel-polyfil in code
*/


/*   non standard of ES2015

const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const mongoClient = require('mongodb').MongoClient;
const Issue= require('./issue.js');
*/

import SourceMapSupport from 'source-map-support'; // npm install --save source-map-support
import 'babel-polyfill'; // ES2015-completed
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import Issue from './issue';
import path from 'path'; // using path.resolve to get absolute path

SourceMapSupport.install();
const app = express();
// middlewares to use
// express built-in middleware
app.use(express.static('static'));
// body-parser module, parse HTTP body
app.use(bodyParser.json());

let db;

// route matching by Express, only matching http GET request
/*
app.get('/api/issues', (req, res)=>{
    const metadata = {total_count: issues.length};
    res.json({_metadata: metadata, records: issues}); // client: curl -s URL | json_pp
    //res.send('Hello World!\n');
});
*/

app.get('/api/issues', (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  db.collection('issues').find(filter).toArray().then((issues) => {
    // if returned array is big, use find().limit(100) or skip(), or toArray().forEach or stream
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues });
    console.log(res);
  })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: `Internal Server Error: ${err}` });
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'));
});

// POST REST api
app.post('/api/issues', (req, res) => {
  const newIssue = req.body;
  newIssue.created = new Date();
  if (!newIssue.status) newIssue.status = 'New';

  // handling err that parsed in input validatiion
  const err = Issue.validateIssue(newIssue);
  if (err) {
    res.status(422).json({ message: `\ninvalid request: \n ${err}` }); // client will callback the message
    return;
  }

  // db... insert
  db.collection('issues').insertOne(newIssue).then(result =>
    db.collection('issues').find({ _id: result.insertedId }).limit(1).next()).then((shitdata) => {
    res.json(shitdata);
  })
    .catch((errParam) => {
      console.log(errParam);
      res.status(500).json({ message: `Internal Server Error: ${errParam}` });
    });
});


/*
app.listen(3000, function() {
    console.log("App started on port 3000");
});
*/


// note: it's differnt connection between MongoDB 3.x and MongoDB 2.x

MongoClient.connect('mongodb://localhost:27017').then((clientDB) => {
  db = clientDB.db('issuetracker'); // new from version 3.0
  app.listen(3000, () => {
    console.log('App started on port 3000');
  });
}).catch((err) => {
  console.log('ERROR: ', err);
});
