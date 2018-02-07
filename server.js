const express = require("express");
const app = express();
app.use(express.static('static'));

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
    res.json({_metadata: metadata, records: issues});
});



app.listen(3000, function() {
    console.log("App started on port 3000");
});