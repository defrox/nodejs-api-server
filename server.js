const app = require('express')();
const https = require('https');
const fs = require('fs');
const delayMin = 1; // in microseconds
const delayMax = 1; // in microseconds
const api2gea = false;
let port = 20550
let ssl = false;
if (api2gea) {
    port = 8081;
    ssl = false;
}

function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

//GET tables
app.get('/', (req, res) => {
    setTimeout(function(){res.json(["s_fin_pub:blacklist","s_fin_pub:whitelist","s_fin_pub:smscoring_porta","s_fin_pub:interconexiones_scores"])}, randomIntInc(delayMin, delayMax));
});

//GET table
app.get('/:namespace\::table/schema', (req, res, next) => {
    const namespace = req.params.namespace;
    const table = req.params.table;
    setTimeout(function(){res.json({"name": namespace.toString() + ":" + table.toString(),"cf": "portabilities","namespace": namespace.toString()})}, randomIntInc(delayMin, delayMax));
});

//GET namespaces
app.get('/namespaces', (req, res) => {
    setTimeout(function(){res.json(["s_fin_pub","s_fin_wrk","s_rosetta_pub","s_rosetta_wrk"])}, randomIntInc(delayMin, delayMax));
});

//GET namespace
app.get('/:namespace', (req, res, next) => {
    const namespace = req.params.namespace;
    setTimeout(function(){res.json({"namespace": namespace.toString()})}, randomIntInc(delayMin, delayMax));
});

//GET namespace tables
app.get('/:namespace/tables', (req, res) => {
    const namespace = req.params.namespace;
    setTimeout(function(){res.json({"name": namespace.toString(), "tables":["s_fin_pub:blacklist","s_fin_pub:whitelist","s_fin_pub:smscoring_porta","s_fin_pub:interconexiones_scores"]})}, randomIntInc(delayMin, delayMax));
});

app.get("/url", (req, res, next) => {
    setTimeout(function(){res.json(["Tony","Lisa","Michael","Ginger","Food"])}, randomIntInc(delayMin, delayMax));
});

app.get("/version/cluster", (req, res, next) => {
    setTimeout(function(){res.send('1.2.0-cdh5.14.2')}, randomIntInc(delayMin, delayMax));
});

app.get("/version", (req, res, next) => {
    setTimeout(function(){res.json({"REST":"0.0.3","JVM":"Oracle Corporation 1.8.0_144-25.144-b01","OS":"Linux 3.10.0-514.6.1.el7.x86_64 amd64","Server":"jetty/6.1.26.cloudera.4","Jersey":"1.9"})}, randomIntInc(delayMin, delayMax));
});

app.get("/status/cluster", (req, res, next) => {
    setTimeout(function(){res.json({"LiveNodes":[{"name":"alice"}]})}, randomIntInc(delayMin, delayMax));
});

app.get("/cell", (req, res, next) => {
    setTimeout(function(){res.json({"column":"cG9ydGFiaWxpdGllczpkYXRlX2xvYWQ=","timestamp":1583150734405,"$":"MjAxOTEyMTA="})}, randomIntInc(delayMin, delayMax));
});

app.get("/cells", (req, res, next) => {
    setTimeout(function(){res.json([{"column":"cG9ydGFiaWxpdGllczpkYXRlX2xvYWQ=","timestamp":1583150734405,"$":"MjAxOTEyMTA="},{"column":"cG9ydGFiaWxpdGllczptb250aHNfcG9ydGFiaWxpdHk=","timestamp":1583150734405,"$":"Mzg="},{"column":"cG9ydGFiaWxpdGllczpwb3J0YWJpbGl0aWVzX2FjdGl2aXRpZXM=","timestamp":1583150734405,"$":"MC40NA=="},{"column":"cG9ydGFiaWxpdGllczp0b3RhbF9lZmZlY3RpdmVzX2wyeQ==","timestamp":1583150734405,"$":"MA=="}])}, randomIntInc(delayMin, delayMax));
});

app.get("/row", (req, res, next) => {
    setTimeout(function(){res.json({"key":"NjAwMDk4ODE5","Cell":[{"column":"cG9ydGFiaWxpdGllczpkYXRlX2xvYWQ=","timestamp":1583150734405,"$":"MjAxOTEyMTA="},{"column":"cG9ydGFiaWxpdGllczptb250aHNfcG9ydGFiaWxpdHk=","timestamp":1583150734405,"$":"Mzg="},{"column":"cG9ydGFiaWxpdGllczpwb3J0YWJpbGl0aWVzX2FjdGl2aXRpZXM=","timestamp":1583150734405,"$":"MC40NA=="},{"column":"cG9ydGFiaWxpdGllczp0b3RhbF9lZmZlY3RpdmVzX2wyeQ==","timestamp":1583150734405,"$":"MA=="}]})}, randomIntInc(delayMin, delayMax));
});

app.get("/rows", (req, res, next) => {
    setTimeout(function(){res.json({"Row":[{"key":"NjAwMDk4ODE5","Cell":[{"column":"cG9ydGFiaWxpdGllczpkYXRlX2xvYWQ=","timestamp":1583150734405,"$":"MjAxOTEyMTA="},{"column":"cG9ydGFiaWxpdGllczptb250aHNfcG9ydGFiaWxpdHk=","timestamp":1583150734405,"$":"Mzg="},{"column":"cG9ydGFiaWxpdGllczpwb3J0YWJpbGl0aWVzX2FjdGl2aXRpZXM=","timestamp":1583150734405,"$":"MC40NA=="},{"column":"cG9ydGFiaWxpdGllczp0b3RhbF9lZmZlY3RpdmVzX2wyeQ==","timestamp":1583150734405,"$":"MA=="}]}]})}, randomIntInc(delayMin, delayMax));
});

app.get("/:database\::table/:key/?(:cf\:family)?/?(:timestamp)?", (req, res, next) => {
    const database = req.params.database;
    const table = req.params.table;
    const key = req.params.key;
    console.log(database, table, key);
    let version = req.query.version;
    let res_out = {"Row":[]};
    let buffKey = new Buffer(key);
    let base64Key = buffKey.toString("base64");
    const realdata = {"Row":[{"key":"NjAwMDk4ODE5","Cell":[{"column":"cG9ydGFiaWxpdGllczpkYXRlX2xvYWQ=","timestamp":1585047237600,"$":"MjAxOTEyMTA="},{"column":"cG9ydGFiaWxpdGllczptb250aHNfcG9ydGFiaWxpdHk=","timestamp":1585047237600,"$":"Mzg="},{"column":"cG9ydGFiaWxpdGllczpwb3J0YWJpbGl0aWVzX2FjdGl2aXRpZXM=","timestamp":1585047237600,"$":"MC40NA=="},{"column":"cG9ydGFiaWxpdGllczp0b3RhbF9lZmZlY3RpdmVzX2wyeQ==","timestamp":1585047237600,"$":"MA=="}]}]};
    if (table === "smscoring_porta" && key !== "notfound" && key !== "000000000") {
        const portaActv = Math.round(Math.random() * 100) / 100;
        const portaActvBuff = new Buffer(portaActv.toString());
        const portaActv64 = portaActvBuff.toString("base64");
        const l2s = randomIntInc(0,5);
        const l2sBuf = new Buffer(l2s.toString());
        const l2sB64 = l2sBuf.toString("base64");
        const months = randomIntInc(0,120);
        const monthsBuf = new Buffer(months.toString());
        const monthsB64 = monthsBuf.toString("base64");
        //console.log(portaActv, portaActv64);
        //console.log(l2s, l2sB64);
        //console.log(months, monthsB64);
        res_out = {"Row":[{"key": base64Key,"Cell":[{"column":"cG9ydGFiaWxpdGllczpkYXRlX2xvYWQ=","timestamp":1583150734405,"$":"MjAxOTEyMTA="},{"column":"cG9ydGFiaWxpdGllczptb250aHNfcG9ydGFiaWxpdHk=","timestamp":1583150734405,"$":monthsB64},{"column":"cG9ydGFiaWxpdGllczpwb3J0YWJpbGl0aWVzX2FjdGl2aXRpZXM=","timestamp":1583150734405,"$":portaActv64},{"column":"cG9ydGFiaWxpdGllczp0b3RhbF9lZmZlY3RpdmVzX2wyeQ==","timestamp":1583150734405,"$":l2sB64}]}]};
    }
    if (table === "interconexiones_scores" && key !== "notfound" && key !== "000000000") {
        score = new Buffer(Math.random().toString());
        scoreB64 = score.toString('base64');
        //console.log(scoreB64);
        res_out = {"Row":[{"key": base64Key,"Cell":[{"column":"aW50ZXJjb25leGlvbmVzOnNjb3JlCg==","timestamp":1583150734405,"$":scoreB64}]}]};
    }
    if (table === "interror" || key === "interror") {
        res_out = res.status(500).send('Internal Server Error');
    }
    if (table === "badrequest" || key === "badrequest") {
        res_out = res.status(400).send('Bad Request');
    }
    if (table === "timeout" || key === "timeout") {
        res_out = res.status(503).send('Service Unavailable');
    }
    if (table === "notfound" || key === "notfound") {
        res_out = res.status(404).send('Not Found');
    }
    if (table !== "timeout" && key !== "timeout" && table !== "interror" && key !== "interror" && table !== "notfound" && key !== "notfound" && table !== "badrequest" && key !== "badrequest") {
        console.log(res_out);
        setTimeout(function(){res.json(res_out);}, randomIntInc(delayMin, delayMax));
    }    
});

app.get("/api/1.0.0/hbase/:database/:table/:key", (req, res, next) => {
    const database = req.params.database;
    const table = req.params.table;
    const key = req.params.key;
    console.log(database, table, key);
    let res_out = {"Row":[]};
    if (table === "smscoring_porta" && key !== "notfound" && key !== "000000000") {
        res_out = {"Row":[{"key": key,"Cell":[{"column":"portabilities:date_load","timestamp":1583150734405,"value":"20191210"},{"column":"portabilities:months_portability","timestamp":1583150734405,"value":"38"},{"column":"portabilities:portabilities_activities","timestamp":1583150734405,"value":"0.44"},{"column":"portabilities:total_effectives_l2y","timestamp":1583150734405,"value":"0"}]}]};
    }
    if (table === "interconexiones_scores" && key !== "notfound" && key !== "000000000") {
        score = Math.random().toString();
        //console.log(score);
        res_out = {"Row":[{"key": key,"Cell":[{"column":"interconexiones:score","timestamp":1583150734405,"value":score}]}]};
    }
    if (table === "interror" || key === "interror") {
        res_out = res.status(500).send('Internal Server Error');
    }
    if (table === "timeout" || key === "timeout") {
        res_out = res.status(503).send('Service Unavailable');
    }
    if (table === "badrequest" || key === "badrequest") {
        res_out = res.status(400).send('Bad Request');
    }
   //console.log(res_out);
    if (table !== "timeout" && key !== "timeout" && table !== "interror" && key !== "interror" && table !== "badrequest" && key !== "badrequest") {
        setTimeout(function(){res.json(res_out);}, randomIntInc(delayMin, delayMax));
    }
});

if (ssl) {
    // we will pass our 'app' to 'https' server
    https.createServer({
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
        passphrase: 'design'
    }, app).listen(port, () => {
        console.log("Mock Hbase Api Server running on https://localhost:" + port);
    });
} else {
    app.listen(port, () => {
        console.log("Mock Hbase Api Server running on http://localhost:" + port);
    });
}
