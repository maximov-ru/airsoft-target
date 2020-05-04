function processReceivedCommand(evt)
{
    console.log('evt', evt);
}

$(document).ready(() => {
   $('#root').text('document loaded');
    function init()
    {
        var Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
        Socket.onmessage = function(event) { processReceivedCommand(event); };
    }
    init()
});