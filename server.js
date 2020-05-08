var express = require('express');
var cors = require('cors');
var app = express();
const brain = require('brain.js');
var fs = require('fs');
const lineReader = require('line-reader');
function readLines(filename, processLine) {
    return new Promise((resolve, reject) => {
        lineReader.eachLine(filename, (line, last, callback) => {
            if (!callback) throw new Error('panic');
            processLine(line)
                .then(() => last ? resolve() : callback())
                .catch(reject);
        });
    });
}
const net = new brain.NeuralNetwork();
let neuroJSON = {};

app.get('/saveData', cors(), function (req, res, next)  {
    console.log(req.query);
    fs.appendFileSync('target.log', JSON.stringify(req.query)+"\r\n");
    res.json({msg: 'This is CORS-enabled for a Single Route'});
});

app.get('/getAllData', cors(), async function (req, res, next)  {
    console.log(req.query);
    res.json(neuroJSON);
});

app.get('/retrain', cors(), async function (req, res, next)  {
    let allLines = [];
    await readLines('target.log', async (line) => {
        let jsonLine = JSON.parse(line);
        //console.log(jsonLine);
        ['a','b','c','d'].forEach(v => jsonLine.input[v] = parseFloat(jsonLine.input[v]));
        ['x','y'].forEach(v => jsonLine.output[v] = parseFloat(jsonLine.output[v]));
        allLines.push(jsonLine);
    });
    let out = net.train(allLines, {
        log: true, // нужен ли периодический console.log()
        logPeriod: 2, // число итераций между логированиями
    });
    neuroJSON = net.toJSON();
    res.json({out});
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

//fs.appendFileSync(eventsFile, JSON.stringify(writeEvent)+"\r\n");