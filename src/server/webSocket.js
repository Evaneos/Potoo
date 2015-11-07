import socketio from 'socket.io';
import { createServer } from 'http';
import argv from './argv';
import { ConsoleLogger } from 'nightingale';
import errorParser from 'alouette';

const logger = new ConsoleLogger('screenSocket');

const screensById = new Map();
const screensByName = new Map();
let areNumbersShown = false;

export const webSocketPort = 3016;
console.log(webSocketPort);
const server = createServer();
export const io = socketio(server);
let words = ["Hong Kong", "Singapore", "Bangkok", "London", "Paris", "Macau", "New York City", "Shenzhen", "Kuala Lumpur", "Antalya", "Istanbul", "Dubai", "Seoul", "Rome", "Phuket", "Guangzhou", "Mecca", "Pattaya", "Taipei", "Miami", "Prague", "Shanghai", "Las Vegas", "Milan", "Barcelona", "Moscow", "Amsterdam", "Vienna", "Venice", "Los Angeles", "Lima", "Tokyo", "Johannesburg", "Beijing", "Sofia", "Orlando", "Berlin", "Budapest", "Ho Chi Minh City", "Florence", "Madrid", "Warsaw", "Doha", "Nairobi", "Delhi", "Mumbai", "Chennai", "Mexico City", "Dublin", "San Francisco", "Hangzhou", "Denpasar", "St. Petersburg", "Muğla", "Brussels", "Burgas", "Munich", "Zhuhai", "Sydney", "Edirne", "Toronto", "Lisbon", "Cancún", "Buenos Aires", "Cairo", "Punta Cana", "Suzhou", "Djerba", "Agra", "Kraków", "Bucharest", "Siem Reap", "Jaipur", "Honolulu", "Manama", "East Province", "Hanoi", "Andorra la Vella", "Nice", "Zurich", "Jakarta", "Manila", "Chiang Mai", "Marrakech", "Sharm el Sheikh", "Marne-La-Vallée", "Frankfurt", "Abu Dhabi", "Vancouver", "Guilin", "Melbourne", "Rio de Janeiro", "Riyadh", "Amman", "Sousse", "Kiev", "Sharjah", "Jeju", "Krabi", "Artvin"];


io.use(function(socket, next) {
    var handshakeData = socket.request;
    next();
});

server.listen(webSocketPort);


function showNumbers() {
    areNumbersShown = true;
    let i = 1;
    screensById.forEach(screen => {
        screen.emit('showNumber', {number: i, name: screen.name});
        console.log('showNumbers');
        i ++;
    })
}

function removeNumbers() {
    screensById.forEach(screen => screen.emit('removeNumber', 'remove'))
}

function getScreenInfos() {
    let ret = '';
    screensById.forEach(screen => ret += ', ' + screen.name + ': ' + ((screen.online)?'on':'off'));
    return ret;
}

function createScreen(socket) {
    let screen = {};
    screen.socket = socket;
    screen.online = true;
    screen.name = '';
    screen.id = socket.id;

    return screen;
}

io.on('connection', socket => {
    console.log('new connection');
    socket.on('addScreen', name => {
        name = decodeURIComponent(name.substring(1));
        console.log('connection: ' + name + ' / ' + socket.id);
        console.log(getScreenInfos());

        // Check if already here
        if (screensByName.has(name)) {

            console.log(name + ' already existed');
            let previousScreen = screensByName.get(name);

            screensById.delete(previousScreen.id);
            screensByName.delete(previousScreen.name);

            let newScreen = createScreen(socket);
            newScreen.name = name;
            screensById.set(newScreen.id,newScreen);
            screensByName.set(name,socket);

        } else {
            let newScreen = createScreen(socket);
            if (name) {
                console.log('let\'s create ' + name);
                newScreen.name = name;
            } else {
                console.log('let\'s create a new screen name');
                // Add screen to the maps
                newScreen.name = words[Math.floor(Math.random() * words.length)];
                words.splice(words.indexOf(newScreen.name), 1);
            }


            socket.emit('setName', newScreen.name);
            screensById.set(newScreen.id, newScreen);
            screensByName.set(newScreen.name, newScreen);
            console.log('screen ' + newScreen.name + ' created');

            // Manage disconnection
            socket.on('disconnect',  () => {
                let screen = screensById.get(socket.id);
                if (screen) {
                    console.log('shutdown: ' + screen.name + ' / ' + screen.id) ;
                    screen.online = false;
                };
            });

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

        }

        console.log((screensById.length || screensById.size) + ' screens: ' + getScreenInfos() );
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

export function getScreenByName(name) {
    return screensByName.get(name);
}

