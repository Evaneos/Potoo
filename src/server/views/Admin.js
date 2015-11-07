export default function({ hostname, webSocketPort, url }) {
    return `
<!DOCTYPE html>
<html>
<head>
<style type="text/css">
.watchme_screen_toolbar .glyphicon {
    opacity: 0;
}

.watchme_screen_toolbar:hover .glyphicon {
    opacity: 1;
}
</style>
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="http://${ hostname }:${ webSocketPort }/socket.io/socket.io.js"></script>
<script type="text/javascript">
    window.hostname = '${ hostname }';
    window.webSocketPort = ${ webSocketPort };
</script>
<script type="text/javascript" src="/js/admin.js"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>

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
    <form id="form_screens">
        <div class="form-group">
            <div id='screens'>
            </div>
        </div>
        <div class="form-group">
            <button type="submit" class="btn btn-default">Submit</button>
        </div>
    </form>

</div>

</body>
</html>
    `
}
