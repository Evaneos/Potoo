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
            <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3" value="{screen.url}"></input>
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
