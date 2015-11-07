import socketio from 'socket.io';
import { createServer } from 'http';
import argv from './argv';
import { ConsoleLogger } from 'nightingale';
import errorParser from 'alouette';
import * as screenFactory from './screenFactory';
import defaultScreens from './screens';

const logger = new ConsoleLogger('screenSocket');

let areNumbersShown = false;

export const webSocketPort = 3016;
const server = createServer();
export const io = socketio(server);

defaultScreens.forEach(screen => screenFactory.addScreen(screen));

io.use(function(socket, next) {
    console.log('initialisation');

    var handshakeData = socket.request;

    next();
});

server.listen(webSocketPort);


function showNumbers(socket) {
    console.log('showNumbers');
    areNumbersShown = true;
    let i = 1;
    screenFactory.screens.forEach(screen => {
        screen.emit('showNumber', {number: i, name: screen.name});
        i ++;
    })
    socket.broadcast.to('admin').emit('showNumbers', true);
}

function removeNumbers(socket) {
    screenFactory.screensById.forEach(screen => screen.emit('removeNumber', 'remove'))
    socket.broadcast.to('admin').emit('showNumbers', false);
}

function broadcastScreen(socket) {
    let screens = screenFactory.getScreensWithoutSocket();
    console.log('nb screens: ' + screens.length);
    io.to('admin').emit('screens', screens);
}

io.on('connection', socket => {
    let who = socket.request._query['who'];
    console.log('who: ' + who);
    if (who = 'admin') {
        socket.join('admin');
        socket.broadcast.to('admin').emit('showNumbers', areNumbersShown);

        socket.on('askScreens', function() {
            socket.emit('screens', screenFactory.getScreensWithoutSocket());
        })
        broadcastScreen(socket);
    }
    console.log('new connection');
    socket.on('addScreen', name => {
        name = decodeURIComponent(name.substring(1));
        let screen = screenFactory.initScreen({socket: socket, name: name, online: true});
        console.log('connection: ' + name + ' / ' + socket.id);
        console.log('infos: ' + screenFactory.getScreenInfos());

        screenFactory.addOrUpdateScreen(screen);

        // ShowNumbers
        if (areNumbersShown) {
            showNumbers();
        }

        console.log('infos: ' + screenFactory.getScreenInfos());
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
        broadcastScreen(socket)
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

