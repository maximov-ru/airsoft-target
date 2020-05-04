String html_1 = R"=====(
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Target web panel</title>
<link rel='stylesheet' href='https://raw.githubusercontent.com/maximov-ru/airsoft-target/master/styles.css'>
<script src='https://code.jquery.com/jquery-3.5.0.min.js'></script>
    <script src='https://yacdn.org/proxy/https://raw.githubusercontent.com/maximov-ru/airsoft-target/master/target.js' crossorigin='anonymous'></script>
</head>
<body>
<div id='root'></div>
    </body>
    </html>
)=====";

String html_1 = R"=====(
<!DOCTYPE html>
<html>
<head>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
  <meta charset='utf-8'>
  <style>
    body    { font-size:120%;}
    #main   { display: table; width: 300px; margin: auto;  padding: 10px 10px 10px 10px; border: 3px solid blue; border-radius: 10px; text-align:center;}
    .button { width:200px; height:40px; font-size: 110%;  }
  </style>
  <title>Websockets</title>
</head>
<body>
  <div id='main'>
    <h3>LED CONTROL</h3>
    <div id='content'>
      <p id='LED_status'>LED is off</p>
      <button id='BTN_LED'class="button">Turn on the LED</button>
    </div>
    <br />
   </div>
</body>

<script>
  var Socket;
  function init()
  {
    Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
  }

  document.getElementById('BTN_LED').addEventListener('click', buttonClicked);
  function buttonClicked()
  {
    var btn = document.getElementById('BTN_LED')
    var btnText = btn.textContent || btn.innerText;
    if (btnText ==='Turn on the LED') { btn.innerHTML = "Turn off the LED"; document.getElementById('LED_status').innerHTML = 'LED is on';  sendText('1'); }
    else                              { btn.innerHTML = "Turn on the LED";  document.getElementById('LED_status').innerHTML = 'LED is off'; sendText('0'); }
  }

  function sendText(data)
  {
    Socket.send(data);
  }

  window.onload = function(e)
  {
    init();
  }
</script>
</html>
)=====";