const app = require('express')();
const https = require('https');
const fs = require('fs');

//GET home route
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

app.get("/:database\::table/:key", (req, res, next) => {
    const database = req.params.database;
    const table = req.params.table;
    const key = req.params.key;
    console.log(database, table, key);
    let res_out = ["Tony","Lisa","Michael","Ginger","Food"];
    const smscoring_porta_res = {"Row":[{"key":"NjAwMDk4ODE5","Cell":[{"column":"cG9ydGFiaWxpdGllczpkYXRlX2xvYWQ=","timestamp":1583150734405,"$":"MjAxOTEyMTA="},{"column":"cG9ydGFiaWxpdGllczptb250aHNfcG9ydGFiaWxpdHk=","timestamp":1583150734405,"$":"Mzg="},{"column":"cG9ydGFiaWxpdGllczpwb3J0YWJpbGl0aWVzX2FjdGl2aXRpZXM=","timestamp":1583150734405,"$":"MC40NA=="},{"column":"cG9ydGFiaWxpdGllczp0b3RhbF9lZmZlY3RpdmVzX2wyeQ==","timestamp":1583150734405,"$":"MA=="}]}]};
    if (table === "smscoring_porta") {
        res_out = smscoring_porta_res;
    }
    res.json(res_out);
});

// we will pass our 'app' to 'https' server
https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'design'
}, app).listen(20550, () => {
    console.log("Mock Hbase Api Server running on port 20550");
});