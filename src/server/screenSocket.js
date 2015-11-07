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


function showNumbers() {
    areNumbersShown = true;
    let i = 1;
    screnFactory.screensById.forEach(screen => {
        screen.emit('showNumber', {number: i, name: screen.name});
        console.log('showNumbers');
        i ++;
    })
}

function removeNumbers() {
    screnFactory.screensById.forEach(screen => screen.emit('removeNumber', 'remove'))
}

io.on('connection', socket => {
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

        socket.on('askShowNumbers', msg => {
            console.log('askNumbers');
            showNumbers();
        })
        socket.on('askRemoveNumbers', msg => {
            console.log('askRemoveNumbers');
            removeNumbers();
        })

        console.log(screenFactory.getScreenInfos());
    });
});


io.on('error', (err) => {
    try {
        errorParser.log(err);
    } catch (err2) {
        console.error(err.stack);
        console.error(err2.stack);
    }
});

