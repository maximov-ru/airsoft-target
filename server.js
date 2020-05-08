var express = require('express');
var cors = require('cors');
var app = express();
var fs = require('fs');

app.get('/saveData', cors(), function (req, res, next)  {
    console.log(req.query);
    fs.appendFileSync('target.log', JSON.stringify(req.query)+"\r\n");
    res.json({msg: 'This is CORS-enabled for a Single Route'});
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

//fs.appendFileSync(eventsFile, JSON.stringify(writeEvent)+"\r\n");