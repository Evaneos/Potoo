import socketio from 'socket.io';
import { createServer } from 'http';
import argv from './argv';
import { ConsoleLogger } from 'nightingale';
import errorParser from 'alouette';
import * as screenFactory from './screenFactory';

const logger = new ConsoleLogger('screenSocket');

let areNumbersShown = false;

export const webSocketPort = 3016;
const server = createServer();
export const io = socketio(server);



io.use(function(socket, next) {
    var handshakeData = socket.request;
    next();
});

server.listen(webSocketPort);


function showNumbers(socket) {
    console.log('showNumbers');
    areNumbersShown = true;
    let i = 1;
    screenFactory.screens.forEach(screen => {
        screen.socket.emit('showNumber', {number: i, name: screen.name});
        i ++;
    })
    socket.broadcast.to('admin').emit('showNumbers');
}

function removeNumbers(socket) {
    screenFactory.screensById.forEach(screen => screen.socket.emit('removeNumber', 'remove'))
    socket.broadcast.to('admin').emit('removeNumbers');
}

io.on('connection', socket => {
    let who = socket.request._query['who'];
    console.log('who: ' + who);
    if (who = 'admin') {
        socket.join('admin');
    }
    console.log('new connection');
    socket.on('addScreen', name => {
        name = decodeURIComponent(name.substring(1));
        console.log('connection: ' + name + ' / ' + socket.id);
        console.log(screenFactory.getScreenInfos());

        screenFactory.addOrUpdateScreen(screenFactory.createScreen(socket, name));

        // ShowNumbers
        if (areNumbersShown) {
            showNumbers();
        }

        console.log(screenFactory.getScreenInfos());
    });


    socket.on('askShowNumbers', msg => {
        console.log('askNumbers');
        showNumbers(socket);
    })
    socket.on('askRemoveNumbers', msg => {
        console.log('askRemoveNumbers');
        removeNumbers(socket);
    })

    screenFactory.listener.on('changed', function() {
        console.log('changed');
        socket.broadcast.to('admin').emit('screens', screenFactory.getScreensWithoutSocket());
    })
});


io.on('error', (err) => {
    try {
        errorParser.log(err);
    } catch (err2) {
        console.error(err.stack);
        console.error(err2.stack);
    }
});

