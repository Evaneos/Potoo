export default function({ hostname, webSocketPort, url }) {
    return `
<!DOCTYPE html>
<html>
<head>
<style type="text/css">

</style>
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="http://${ hostname }:${ webSocketPort }/socket.io/socket.io.js"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>

<script>


  var socket = io("http://${ hostname }:${ webSocketPort }");
  socket.on('connect', function() {
        console.log('connected');
        socket.on('showNumber', function(msg) {
            $("body").append('<div class="watchme_number"><span>' + msg.number + '<br/><span class="watchme_name">' + msg.name + '</span></span></div>');
        })

        socket.on('removeNumber', function(msg) {
            $(".watchme_number").remove();
        })

        socket.on('setName', function(name) {
            window.history.pushState({}, document.title, "/" + name);
        })

        // Connect this screen
        socket.emit('addScreen', window.location.pathname);

        $(document).on("keypress", function (e) {
            console.log('keyPress' + e.which);
            if (e.which == 97) {
                console.log('askShowNumbers');
                socket.emit('askShowNumbers');
            }
            if (e.which == 122) {
                console.log('askRemoveNumbers');
                socket.emit('askRemoveNumbers');
            }
        });
  })
  socket.on('error', function(msg) {
        console.log('error:',msg);
  })
</script>
</head>

<body>
<div class="container">

      <div class="page-header">
        <h1>Admin of your screens</h1>
        <p class="lead">You are able to change the urls from here :) </p>
      </div>
    <div class="form-group">
        <div class="btn-group" data-toggle="buttons">
            <label class="btn btn-primary active">
            <input type="radio" name="options" id="option1" autocomplete="off" checked> Show Numbers
            </label>
            <label class="btn btn-primary">
            <input type="radio" name="options" id="option2" autocomplete="off"> Hide Numbers
            </label>
        </div>
    </div>
    <div class="form-group">
        <div class="btn-group" data-toggle="buttons">
            <label for="basic-url">Nom de la cha&icirc;ne</label>
            <div class="input-group">
              <span class="input-group-addon" id="basic-addon3">http://</span>
              <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="btn-group" data-toggle="buttons">
            <label for="basic-url">Nom de la cha&icirc;ne</label>
            <div class="input-group">
              <span class="input-group-addon" id="basic-addon3">http://</span>
              <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="btn-group" data-toggle="buttons">
            <label for="basic-url">Nom de la cha&icirc;ne</label>
            <div class="input-group">
              <span class="input-group-addon" id="basic-addon3">http://</span>
              <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
            </div>
        </div>
    </div>

</div>

</body>
</html>
    `
}