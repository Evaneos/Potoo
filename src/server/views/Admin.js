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


  var socket = io("http://${ hostname }:${ webSocketPort }", {query: "who=admin"});

  function showNumbers() {
    console.log('askShowNumbers');
    socket.emit('askShowNumbers', 'test');
  }
  function removeNumbers() {
    console.log('askRemoveNumbers');
    socket.emit('askRemoveNumbers', 'test');
  }

  function renderScreen(screen) {
    return `
    <div class="form-group">
        <div class="btn-group" data-toggle="buttons">
            <label for="basic-url">${screen.name}</label>
            <div class="input-group">
              <span class="input-group-addon" id="basic-addon3">http://</span>
              <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3" value="{screen.url}">
            </div>
        </div>
    </div>
    `;
  }

  socket.on('connect', function() {
        console.log('connected');

        $(document).on("keypress", function (e) {
            console.log('keyPress' + e.which);
            if (e.which == 97) {
                showNumbers();
            }
            if (e.which == 122) {
                removeNumbers();
            }
        });

        socket.on('showNumbers', function(msg) {
            console.log('showNumbers');
            $("#on").attr('checked', true);
            $("#off").attr('checked', false);
            $("#on").parent().addClass('active');
            $("#off").parent().removeClass('active');
        })

        socket.on('removeNumbers', function(msg) {
            console.log('REMOVENumbers');
            $("#off").attr('checked', true);
            $("#on").attr('checked', false);
            $("#off").parent().addClass('active');
            $("#on").parent().removeClass('active');
        })

        socket.on('screens', function(screens) {
            $("#screens").empty();
            screens.forEach(screen => {
                $("#screens").append(renderScreen(screen));
            })
        })
  })
  socket.on('error', function(msg) {
        console.log('error:',msg);
  })


$(function() {
  $("[data-showNumbers]").click(function() {
    var val = ($(this).attr('data-showNumbers') == 'true');
    if (val) {
        showNumbers();
    } else {
        removeNumbers();
    }
    console.log($('input[name=showNumbers]:checked', '#showNumbers').val());
  })
});
</script>
</head>

<body>
<div class="container">

      <div class="page-header">
        <h1>Admin of your screens</h1>
        <p class="lead">You are able to change the urls from here :) </p>
      </div>
    <div class="form-group">
        <div class="btn-group" data-toggle="buttons" id="showNumbers">
            <label class="btn btn-primary active" data-showNumbers="true">
            <input type="radio" name="showNumbers" id="on" value='on' checked> Show Numbers
            </label>
            <label class="btn btn-primary" data-showNumbers="false">
            <input type="radio" name="showNumbers" id="off"  value='off'> Hide Numbers
            </label>
        </div>
    </div>
    <div id='screens'>
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

</div>

</body>
</html>
    `
}