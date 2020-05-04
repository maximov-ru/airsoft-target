var page = {
    name: 'main'
};
pagesData = {};

function renderMainPage() {
    page.name = 'main';
    $('#root').html(pagesData[page.name]);
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
    '<div class="container">' +
    '   <div class="row">' +
    '   <div class="col-2"></div><div class="col-8">' +
    '<button class="btn btn-primary">Calibrate</button>" ' +
    '</div><div class="col-2"></div>' +
    '   </div>' +
    '</div>';