export default function({ hostname, webSocketPort }) {
    return `<!DOCTYPE html>
<html>
<head>
<style type="text/css">
body, html {
    margin: 0;
    height: 100%;
}

iframe.watchme_iframe {
    width: 100%;
    border: 0;
    position: static;
    left:0px;
    top: 0px;
    overflow:hidden;
    bottom: 0px;
    display: block;
}

.watchme_number {
    background-color: rgba(0,0,0,0.8);
    color: white;
    text-align: center;
    width: 100%;
    position: fixed;
    top:0px;
    left:0px;
    height:100%;
    font-weight: bold;
    font-size:300px;
    display: table;
    line-height: 50px;
}
.watchme_number > span {
  display: table-cell;
  vertical-align: middle;
}
.watchme_number .watchme_name {
    font-size:40px;
}
</style>
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="http://${ hostname }:${ webSocketPort }/socket.io/socket.io.js"></script>
<script>


  var socket = io("http://${ hostname }:${ webSocketPort }", {query: "who=screen"});
  socket.on('connect', function() {
        console.log('connected');
        socket.on('showNumber', function(msg) {
            console.log('showNumbers');
            $(".watchme_number").remove();
            $("body").append('<div class="watchme_number"><span>' + msg.number + '<br/><span class="watchme_name">' + msg.name + '</span></span></div>');
        })

        socket.on('removeNumber', function(msg) {
            $(".watchme_number").remove();
        })

        socket.on('setScreen', function(screen) {
            window.history.pushState({}, document.title, "/" + screen.name);
            $(".watchme_iframe").attr('src', screen.url);
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
<!-- https://docs.google.com/spreadsheets/d/1LRZiQpNFHpaFiWQg_HzMOk6X1EGrUhFzFiFnIJ05GHE/edit?usp=sharing-->
    <iframe frameborder="0"  height="100%" width="100%" class="watchme_iframe" src="/empty"></iframe>
</body>
</html>
    `
}