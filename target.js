var page = {
    name: 'main'
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
    $('#to-main-page').on('click', () => {renderMainPage()});
}

function processReceivedCommand(evt)
{
    console.log('evt', evt);
}

$(document).ready(() => {
   //$('#root').text('document loaded');
    renderMainPage()
    function init()
    {
        var Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
        Socket.onmessage = function(event) { processReceivedCommand(event); };
    }
    init()
});

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
    '    <label for="x-from">X Axis Range</label>\n' +
    '    <input type="number" class="form-control" id="x-from" >\n' +
    '    <input type="number" class="form-control" id="x-to">\n' +
    '  </div>\n' +
    '  <div class="form-group">\n' +
    '    <label for="y-from">Y Axis Range</label>\n' +
    '    <input type="number" class="form-control" id="y-from" >\n' +
    '    <input type="number" class="form-control" id="y-to">\n' +
    '  </div>\n' +
    '  <button type="submit" class="btn btn-primary" id="to-main-page">Back</button>\n' +
    '</form>' +
    '</div><div class="col-4"></div>' +
    '   </div>' +
    '</div>';