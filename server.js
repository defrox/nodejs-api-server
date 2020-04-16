var argv = require('minimist')(process.argv.slice(2));

const help = argv['h'] ? argv['h'] : argv['help'] ? argv['help'] : false;
const ssl = argv['s'] ? argv['s'] : argv['ssl'] ? argv['ssl'] : false;
const port = argv['p'] ? argv['p'] : argv['port'] ? argv['port'] : 8080;
let delayMin = argv['f'] ? argv['f'] : argv['delaymin'] ? argv['delaymin'] : 0; // in microseconds
const delayMax = argv['t'] ? argv['t'] : argv['delaymax'] ? argv['delaymax'] : 0; // in microseconds
delayMin = delayMax < delayMin ? delayMax : delayMin;
const mode = argv['m'] ? argv['m'] : argv['mode'] ? argv['mode'] : 'hbase'; // Mode options: hbase, api2gea, elastic (more to come...)

var usage = "\n" +
            "Description: this scripts runs a simple API Mock Server" + "\n" +
            "Usage: nodejs server.js [options]" + "\n\n" +
            "Option          Default     Meaning" + "\n" +
            "-h, --help                  Shows this help message" + "\n" +
            "-s, --ssl       false       Enables https" + "\n" +
            "-p, --port      8080        Specifies the port the server will listen to" + "\n" +
            "-f, --delaymin  0           Minimum delay for responses (in microseconds)" + "\n" +
            "-t, --delaymax  0           Maximum delay for responses (in microseconds)" + "\n" +
            "-m, --mode      hbase       Sets the server mode [hbase, api2gea, elastic]"
if (help) {
    console.log(usage);
    process.exit();
};
//console.dir(argv);
//console.log(delayMin);

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
const https = require('https');
const fs = require('fs');

function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

if (mode == 'hbase') {
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
            //interconexiones:varios_num_x_peticion
            //aW50ZXJjb25leGlvbmVzOnZhcmlvc19udW1feF9wZXRpY2lvbgo=
            res_out = {"Row":[{"key": base64Key,"Cell":[{"column":"aW50ZXJjb25leGlvbmVzOnZhcmlvc19udW1feF9wZXRpY2lvbgo=","timestamp":1583150734405,"$":"MAo="},{"column":"aW50ZXJjb25leGlvbmVzOnNjb3JlCg==","timestamp":1583150734405,"$":scoreB64}]}]};
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
} else if (mode == 'api2gea') {
    app.get("/api/1.0.0/hbase/:database/:table/:key", (req, res, next) => {
        const database = req.params.database;
        const table = req.params.table;
        const key = req.params.key;
        // console.log(database, table, key);
        let res_out = {"Row":[]};
        if (table === "smscoring_porta" && key !== "notfound" && key !== "000000000") {
            res_out = {"Row":[{"key": key,"Cell":[{"column":"portabilities:date_load","timestamp":1583150734405,"value":"20191210"},{"column":"portabilities:months_portability","timestamp":1583150734405,"value":"38"},{"column":"portabilities:portabilities_activities","timestamp":1583150734405,"value":"0.44"},{"column":"portabilities:total_effectives_l2y","timestamp":1583150734405,"value":"0"}]}]};
        } else if (table === "smscoring_porta" && (key === "notfound" || key === "000000000")) {
            res_out = res.status(404).send('Not Found');
        }
        if (table === "interconexiones_scores" && key !== "notfound" && key !== "000000000") {
            score = Math.random().toString();
            console.log(database, table, key, score);
            res_out = {"Row":[{"key": key,"Cell":[{"column":"interconexiones:score","timestamp":1583150734405,"value":score},{"column":"interconexiones:varios_num_x_peticion","timestamp":1583150734405,"value":"0"}]}]};
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
} else if (mode == 'elastic') {
    //GET cluster health
    app.get("/?(vm|w|wa|we)?/_cluster/health", (req, res, next) => {
        let res_out = {"cluster_name":"es-cluster-yec01-aot-005","status":"green","timed_out":false,"number_of_nodes":1,"number_of_data_nodes":1,"active_primary_shards":29,"active_shards":29,"relocating_shards":0,"initializing_shards":0,"unassigned_shards":0,"delayed_unassigned_shards":0,"number_of_pending_tasks":0,"number_of_in_flight_fetch":0,"task_max_waiting_in_queue_millis":0,"active_shards_percent_as_number":100.0};
        setTimeout(function(){res.json(res_out)}, randomIntInc(delayMin, delayMax));
    });
    app.post("/_search", (req, res, next) => {
        console.dir(req.body);
        /*fs.writeFile('body.json', JSON.stringify(req.body), function (err) {
          if (err) return console.log(err);
          console.log('req.body > body.json');
        });*/
        let rawdata = fs.readFileSync('response-vm.json');
        let res_out = JSON.parse(rawdata);
        setTimeout(function(){res.json(res_out)}, randomIntInc(delayMin, delayMax));
    });
    app.post("/vm/_search", (req, res, next) => {
        console.dir(req.body);
        /*fs.writeFile('body.json', JSON.stringify(req.body), function (err) {
          if (err) return console.log(err);
          console.log('req.body > body.json');
        });*/
        let rawdata = fs.readFileSync('response-vm.json');
        let res_out = JSON.parse(rawdata);
        setTimeout(function(){res.json(res_out)}, randomIntInc(delayMin, delayMax));
    });
    app.post("/we/_search", (req, res, next) => {
        console.dir(req.body);
        /*fs.writeFile('body-w.json', JSON.stringify(req.body), function (err) {
          if (err) return console.log(err);
          console.log('req.body > body-w.json');
        });*/
        let rawdata = fs.readFileSync('response-we.json');
        let res_out = JSON.parse(rawdata);
        setTimeout(function(){res.json(res_out)}, randomIntInc(delayMin, delayMax));
    });
    app.post("/wa/_search", (req, res, next) => {
        console.dir(req.body);
        /*fs.writeFile('body-wa.json', JSON.stringify(req.body), function (err) {
          if (err) return console.log(err);
          console.log('req.body > body-wa.json');
        });*/
        let rawdata = fs.readFileSync('response-wa.json');
        let res_out = JSON.parse(rawdata);
        setTimeout(function(){res.json(res_out)}, randomIntInc(delayMin, delayMax));
    });


}


if (ssl == true) {
    // we will pass our 'app' to 'https' server
    https.createServer({
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
        passphrase: 'design'
    }, app).listen(port, () => {
        console.log("Mock " + capitalize(mode) + " Api Server running on https://localhost:" + port);
    });
} else {
    app.listen(port, () => {
        console.log("Mock " + capitalize(mode) + " Api Server running on http://localhost:" + port);
    });
}
