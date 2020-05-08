var page = {
    name: 'main',
    config: {
        size: {x: 35, y: 28},
        aCoord: coord(1,1),
        bCoord: coord(1,27),
        cCoord: coord(34,1),
        dCoord: coord(34,27),
        positions: [[1,1],[1,27],[34,1]]
    },
    current: {
        x: 20,
        y: 20
    },
    count: 0,
    net: null
};
pagesData = {};

function renderMainPage() {
    page.name = 'main';
    console.log(page.name);
    $('#root').html(pagesData[page.name]);
    $('#calibrate').on('click', () => {renderCalibratePage()});
}

function renderCalibratePage() {
    page.name = 'calibrate';
    console.log(page.name);
    $('#root').html(pagesData[page.name]);
    $('#x-size').val(page.config.size.x);
    $('#y-size').val(page.config.size.y);
    $('#to-main-page').on('click', () => {renderMainPage()});
    $('#set').on('click', () => {
        page.config.size.x = $('#x-size').val();
        page.config.size.y = $('#y-size').val();
        renderCalibrateRunPage();
    });
}

function renderCalibrateRunPage() {
    page.name = 'calibrate_run';
    console.log(page.name);
    $('#root').html(pagesData[page.name]);
    generate();
    page.count = 0;
    $('#to-main-page').on('click', () => {renderMainPage()});
    $('#simulate').on('click', () => {generate()});
}

function processReceivedCommand(evt)
{
    console.log('evt', evt);
    let rawData = evt.data;
    console.log(rawData);
    let re = /A\s(\d+)B\s(\d+)C\s(\d+)D\s(\d+)/gm;
    let matches = re.exec(rawData);
    if (matches && matches.length >=5) {
        if (page.name == 'calibrate_run') {
            addCalibrateSample({a: parseInt(matches[1]), b: parseInt(matches[2]), c: parseInt(matches[3]), d: parseInt(matches[4])})
        }
    } else {
        console.log('bad data', rawData);
    }
}

$(document).ready(() => {
   //$('#root').text('document loaded');
    renderMainPage();
    function init()
    {
        var Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
        Socket.onmessage = function(event) { processReceivedCommand(event); };
        page.net = new brain.NeuralNetwork();
        //page.tri = new Triangulation();
        loadDataForTrain();
    }
    init();
});

function addCalibrateSample(sample) {
    let xNorm = page.current.x / page.config.size.x;
    let yNorm = page.current.y / page.config.size.y;
    saveResultToStore(sample, xNorm, yNorm);
    if (page.count) {
        let output = page.net.run(sample);
        //let tri = page.tri.findLocation(page.config.positions, [sample.a, sample.b, sample.c]);
        $('#previous-info').text(
            JSON.stringify(
                {
                    input: sample,
                    output:
                        {
                            x: output.x * page.config.size.x,
                            y: output.y * page.config.size.y
                        },
                    real: {
                        x: page.current.x,
                        y: page.current.y
                    },
                    //tri: tri
                })
        );
    }
    /*page.net.train([
        {input:sample, output: {x: xNorm, y: yNorm}}
        ]);*/
    page.count++;
}

function saveResultToStore(sample, xNorm, yNorm) {
    $.ajax('http://127.0.0.1:3000/saveData', {
        data: {input:sample, output: {x: xNorm, y: yNorm}}
    });
}

function loadDataForTrain() {
    $.ajax('http://127.0.0.1:3000/getAllData', {
        dataType: 'json',
        success: (data) => {
            page.net.fromJSON(data);
        }
    });
}

function loadNeuralConfig() {

}

function saveNeuralConfig() {

}

function simulate() {
    let test = coord(page.current.x, page.current.y);
    let aLen = Math.round((page.config.aCoord.distance(test)));
    let bLen = Math.round((page.config.bCoord.distance(test)));
    let cLen = Math.round((page.config.cCoord.distance(test)));
    let dLen = Math.round((page.config.dCoord.distance(test)));
    let minLen = Math.min(aLen, bLen, cLen, dLen);
    let line = 'A ' + (aLen-minLen) + 'B ' + (bLen - minLen) + 'C ' + (cLen - minLen) + 'D ' + (dLen - minLen) + "\r\n";
    processReceivedCommand({data: line});
}

function generate() {
    page.current.x = Math.round(Math.random() * (page.config.size.x - 2)) + 1;
    page.current.y = Math.round(Math.random() * (page.config.size.y - 2)) + 1;
    $('#x-coord').text(page.current.x);
    $('#y-coord').text(page.current.y);
}

pagesData.main = '' +
    '<div class="container h-100">' +
    '   <div class="row h-100 align-items-center">' +
    '   <div class="col-4"></div><div class="col-3">' +
    '<button class="btn btn-primary" id="calibrate">Calibrate</button> <button class="btn btn-primary">Target</button>' +
    '</div><div class="col-4"></div>' +
    '   </div>' +
    '</div>';

pagesData.calibrate = '' +
    '<div class="container h-100">' +
    '   <div class="row h-100 align-items-center">' +
    '   <div class="col-4"></div><div class="col-3">' +
    '<form>\n' +
    '  <div class="form-group">\n' +
    '    <label for="x-from">X Axis Size</label>\n' +
    '    <input type="number" class="form-control" id="x-size" >\n' +
    '  </div>\n' +
    '  <div class="form-group">\n' +
    '    <label for="y-from">Y Axis Size</label>\n' +
    '    <input type="number" class="form-control" id="y-size" >\n' +
    '  </div>\n' +
    '  <button type="submit" class="btn btn-primary" id="to-main-page">Back</button><button type="submit" class="btn btn-secondary ml-5" id="set">Set</button>\n' +
    '</form>' +
    '</div><div class="col-4"></div>' +
    '   </div>' +
    '</div>';

pagesData.calibrate_run = '' +
    '<div class="container h-100">' +
    '   <div class="row h-100 align-items-center">' +
    '   <div class="col-4"><p id="previous-info"></p></div><div class="col-3">' +
    '      <div class="row"><div class="col-12">' +
    '         <h4>Kick to</h4><br/><h2 id="x-coord"></h2><br/><h2 id="y-coord"></h2>' +
    '         <button type="submit" class="btn btn-primary" id="to-main-page">Back</button><button type="submit" class="btn btn-secondary ml-5" id="simulate">Simulate</button>' +
    '       </div></div>' +
    '    </div><div class="col-4"></div>' +
    '   </div>' +
    '</div>';


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
coord.prototype.update = function (x, y){
    this.x = x;
    this.y = y;
};
coord.prototype.same = function(c){
    if(c.x == this.x && c.y == this.y){
        return true;
    }
    return false;
};


class Triangulation {
    constructor() {
        this.speed = 1;

    }

    findLocation(position, timings) {
        this.update = [5, 0, 0];
        this.answer = [0, 0, 0];
        let negF = [0, 0, 0];
        let A = [[0,0,0],[0,0,0],[0,0,0]];
        this.inverseResult = [[0,0,0],[0,0,0],[0,0,0]];
        let times = [];
        let minTimeIndex = 0;
        for (let i = 0;i<timings.length;i++) {
            times.push(timings[i]);
            if(times[i] < times[minTimeIndex]) {
                minTimeIndex = i;
            }
        }
        while(this.norm4(this.update) > 0.000001) {
            for(let i = 0; i < 3; i++){
                negF[i] = this.negFunction(this.answer, position[i], times[i]);
            }
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    A[i][j] = this.dfdvar( this.answer, position[i], j);
                }
            }
            this.inverse(A);
            console.log('neg',JSON.stringify(negF));
            this.multMatVect4(this.inverseResult, negF);
            this.addVect4(this.answer, this.update);
            console.log('ans', JSON.stringify(this.answer));
        }
        return this.answer;
    }

    // Finds the inverse of the 3x3 matrix, a
    // Stores the result in (global) inverse4Result
    inverse(a) {
        console.log(JSON.stringify(a));
        this.inverseResult = math.inv(a);
    }

    // Matrix multiply of (3x3 matrix), a, and (3x1 vector), b
    // Stores the result in (global) update
    multMatVect4(a, b) {
        let temp = 0;
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                temp += a[i][j]*b[j];
            }

            this.update[i] = temp;
            temp = 0;
        }
    }

    // Add vectors a and b and store result in (global) answer
    addVect4(a, b) {
        for(let i = 0; i < 3; i++) {
            this.answer[i] = a[i]+b[i];
        }
    }

    // Calculates the value of ((x-xn)^2 + (y-yn)^2 + (z-zn)^2)
    // a - answer, b - pos
    function1(a, b) {
        let temp = 0;
        for(let i = 0; i < 2; i++) {
            temp += Math.pow((a[i]-b[i]), 2);
        }
        return temp;
    }

    // Calculates the value of d(f)/d(var)
    // a - answer, b - pos
    // var-p -> x-0, y-1, t-2
    dfdvar(a, b, p) {
        let temp = 0;

        if(p == 2) {
            return this.speed;
        }

        temp = this.function1(a, b);
        temp = Math.pow(temp, -0.5) * (a[p]-b[p]);
        return temp;
    }

    //a[3] - answer, b[2] - pos, t - time
    negFunction(a, b, t) {
        let temp = 0;
        temp = this.function1(a, b);
        temp = Math.pow(temp, 0.5) - this.speed * (t-a[2]);
        return -temp;
    }

   // calculates magnitude of vector
   norm4(vector) {
        let temp = 0;
        for(let i = 0; i < 3; i++) {
            temp += Math.pow(vector[i], 2);
        }
        console.log('norm', temp);
        return temp;
    }
}
