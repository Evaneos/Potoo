'use strict';

var socket = io('http://' + window.hostname + ':' + window.webSocketPort, { query: "who=admin" });

function showNumbers() {
    console.log('askShowNumbers');
    socket.emit('askShowNumbers', 'test');
}
function removeNumbers() {
    console.log('askRemoveNumbers');
    socket.emit('askRemoveNumbers', 'test');
}

function renderScreen(screen) {
    var classOnline = "glyphicon-unchecked";
    if (screen.online) {
        classOnline = 'glyphicon-expand';
    }
    return '\n  <div class="form-group">\n      <div class="btn-group" data-toggle="buttons">\n          <span class=\'watchme_screen_toolbar\'><span class="glyphicon glyphicon-remove text-danger" aria-hidden="true"></span> <label for="basic-url">' + screen.name + '</label> <span class="glyphicon glyphicon-link" aria-hidden="true"></span></span>\n          <div class="input-group">\n            <span class="input-group-addon" id="basic-addon3">http://</span>\n            <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3" value="' + screen.url + '"></input>\n            <span class="input-group-addon"><span class="glyphicon ' + classOnline + '" aria-hidden="true"></span></span>\n          </div>\n      </div>\n  </div>\n  ';
}

socket.on('connect', function () {
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

    socket.on('showNumbers', function (areNumbersShown) {
        if (areNumbersShown) {
            console.log('showNumbers');
            $("#on").attr('checked', true);
            $("#off").attr('checked', false);
            $("#on").parent().addClass('active');
            $("#off").parent().removeClass('active');
        } else {
            console.log('REMOVENumbers');
            $("#off").attr('checked', true);
            $("#on").attr('checked', false);
            $("#off").parent().addClass('active');
            $("#on").parent().removeClass('active');
        }
    });

    socket.on('screens', function (screens) {
        $("#screens").empty();
        screens.forEach(function (screen) {
            $("#screens").append(renderScreen(screen));
        });
    });

    socket.emit("askScreens");
});
socket.on('error', function (msg) {
    console.log('error:', msg);
});

$(function () {
    $("[data-showNumbers]").click(function () {
        var val = $(this).attr('data-showNumbers') == 'true';
        if (val) {
            showNumbers();
        } else {
            removeNumbers();
        }

        $("#form_screens").submit(function (event) {
            console.log(event);
            event.stopPropagation();
            event.preventDefault();
            return false;
        });
    });
});
//# sourceMappingURL=admin.js.map
