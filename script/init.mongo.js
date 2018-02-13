db = new Mongo().getDB('issuetracker');

db.issues.remove({}); // delete all original documents

db.issues.insertMany([
  {
    status: 'Open', owner: 'Ravan',
    created: new Date('2016-08-15'), effort: 5, completionDate: undefined,
    title: 'Error in console when clicking Add',
  },
  {
    status: 'Assigned', owner: 'Eddie',
    created: new Date('2016-08-16'), effort: 14, completionDate: new Date('2016-08-30'),
    title: 'Missing bottom border on panel',
  },
]);

db.issues.createIndex({ status: 1 });  // 1 : asending order
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 });