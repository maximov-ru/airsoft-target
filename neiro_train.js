const brain = require('brain.js');
var fs = require('fs');


function coord(x, y, constructor){
    if(constructor){
        this.x = x;
        this.y = y;
    }else{
        return new coord(x,y, true);
    }
}
coord.prototype.coordConstructor = true;
coord.prototype.distance = function(c2){
    var dx = this.x - c2.x;
    var dy = this.y - c2.y;
    return Math.sqrt(dx*dx+dy*dy);
};

const size = {x: 350, y: 280};
const oneLen = Math.sqrt(size.x*size.x+size.y*size.y);

function generateTrainData(count) {

    let dataSet = [];
    let generatePoint = (from, to, len) => {
        return coord(
            Math.round(Math.random() * (to.x - from.x) + from.x) / len,
            Math.round(Math.random() * (to.y - from.y) + from.y) / len
        );
    };
    let speed = Math.round(Math.random()* 100) / 100;
    let pointA = generatePoint(coord(1,1),coord(35,35), oneLen);
    let pointB = generatePoint(coord(1,245),coord(35,279), oneLen);
    let pointC = generatePoint(coord(315,1),coord(349,35), oneLen);
    let pointD = generatePoint(coord(315,245),coord(349,279), oneLen);
    for (let i = 0;i<count;i++) {

        let findPoint = generatePoint(coord(1,1),coord(349,279), oneLen);

        let dA = pointA.distance(findPoint);
        let dB = pointB.distance(findPoint);
        let dC = pointC.distance(findPoint);
        let dD = pointD.distance(findPoint);

        let minLen = Math.min(dA, dB, dC, dD);
        let input = {
            speed: speed,
            ax: pointA.x, ay: pointA.y, at:(dA - minLen) / speed,
            bx: pointB.x, by: pointB.y, bt: (dB - minLen) / speed,
            cx: pointC.x, cy: pointC.y, ct: (dC - minLen) / speed,
            dx: pointD.x, dy: pointD.y, dt: (dD - minLen) / speed,
        };
        let output = {x: findPoint.x, y: findPoint.y, t: minLen / speed};
        dataSet.push({input, output});
    }
    return dataSet;
}
function datasetMapper(set) {
    const {speed,ax,ay,at,bx,by,bt,cx,cy,ct,dx,dy,dt} = set.input;
    const {x, y, t} = set.output;
    return {input: [speed,ax,ay,at,bx,by,bt,cx,cy,ct,dx,dy,dt], output: [x, y, t]}
}
function outputMapper(out) {
    return {x: out[0], y: out[1], t: out[2]};
}
/**/
let neuroFN = 'neuro.json'
//fs.writeFileSync('/tmp/test-sync', 'Hey there!');
let neuroJSON = fs.readFileSync(neuroFN);

const net = new brain.NeuralNetwork();//{ hiddenLayers: [30, 30, 30, 30] });
console.log(neuroJSON.length);
if (neuroJSON && neuroJSON.length) {
    net.fromJSON(JSON.parse(neuroJSON));
}

let trainData = generateTrainData(2000);
console.log(trainData[0]);
/*net.train(trainData, {
    errorThresh: 0.05, // порог ошибок, которого нужно достичь
    iterations: 100, // максимальное число итераций обучения
    log: true, // нужен ли периодический console.log()
    logPeriod: 2, // число итераций между логированиями
    learningRate: 0.3 // степень обучения
});*/
net.train(trainData.map(datasetMapper), {
    log: true, // нужен ли периодический console.log()
    logPeriod: 2, // число итераций между логированиями
});


let checkData = generateTrainData(1);

const output = outputMapper(net.run(datasetMapper(checkData[0]).input));
console.log(output, checkData[0].output);
console.log(output.x * oneLen, output.y * oneLen);
console.log(checkData[0].output.x * oneLen, checkData[0].output.y * oneLen);
neuroJSON = net.toJSON();
fs.writeFileSync(neuroFN, JSON.stringify(neuroJSON));
/*
var net = new brain.NeuralNetwork();

net.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 0.4 }},
    {input: { r: 0.16, g: 0.09, b: 30 }, output: { white: 2 }},
    {input: { r: 0.5, g: 0.5, b: 19 }, output: { white: 2 }}]);

var output = net.run({ r: 1, g: 0.4, b: 1 }); // { white: 0.99, black: 0.002 }
console.log(output);*/