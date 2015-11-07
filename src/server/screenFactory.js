import { EventEmitter } from 'events';
export const listener = new EventEmitter();
let words = ["Hong Kong", "Singapore", "Bangkok", "London", "Paris", "Macau", "New York City", "Shenzhen", "Kuala Lumpur", "Antalya", "Istanbul", "Dubai", "Seoul", "Rome", "Phuket", "Guangzhou", "Mecca", "Pattaya", "Taipei", "Miami", "Prague", "Shanghai", "Las Vegas", "Milan", "Barcelona", "Moscow", "Amsterdam", "Vienna", "Venice", "Los Angeles", "Lima", "Tokyo", "Johannesburg", "Beijing", "Sofia", "Orlando", "Berlin", "Budapest", "Ho Chi Minh City", "Florence", "Madrid", "Warsaw", "Doha", "Nairobi", "Delhi", "Mumbai", "Chennai", "Mexico City", "Dublin", "San Francisco", "Hangzhou", "Denpasar", "St. Petersburg", "Muğla", "Brussels", "Burgas", "Munich", "Zhuhai", "Sydney", "Edirne", "Toronto", "Lisbon", "Cancún", "Buenos Aires", "Cairo", "Punta Cana", "Suzhou", "Djerba", "Agra", "Kraków", "Bucharest", "Siem Reap", "Jaipur", "Honolulu", "Manama", "East Province", "Hanoi", "Andorra la Vella", "Nice", "Zurich", "Jakarta", "Manila", "Chiang Mai", "Marrakech", "Sharm el Sheikh", "Marne-La-Vallée", "Frankfurt", "Abu Dhabi", "Vancouver", "Guilin", "Melbourne", "Rio de Janeiro", "Riyadh", "Amman", "Sousse", "Kiev", "Sharjah", "Jeju", "Krabi", "Artvin"];


export const screensById = new Map();
export const screensByName = new Map();
export const screens = [];

export function getScreenInfos() {
    let ret = '';
    screens.forEach(screen => ret += ', ' + screen.name + '/' + screen.id + ': ' + ((screen.online)?'on':'off'));
    return (screens.length || screens.size) + ' screen(s): ' + ret;
}

export function getScreensWithoutSocket() {
    var screensWithoutSocket = [];
    screens.forEach(screen => {
        let screenWithoutSocket = Object.assign({}, screen);
        delete screenWithoutSocket.socket;
        screensWithoutSocket.push(screenWithoutSocket);
    })
    return screensWithoutSocket;
}

export function createScreen(socket,name) {
    let screen = {};
    screen.socket = socket;
    screen.online = true;
    screen.name = name || getWord();
    screen.id = socket.id;

    return screen;
}

function getWord() {
    let word = words[Math.floor(Math.random() * words.length)];
    words.splice(words.indexOf(word), 1);

    return word;
}

export function removeScreen(screen) {
    let ret = screensById.delete(screen.id);
    screensByName.delete(screen.name);
    console.log('removed: ' + screen.name + ' / ' + screen.id) ;
    listener.emit('changed');
    return ret;
}

export function getPositionByName(name) {
    return screens.findIndex(screen => screen.name === name)
}

export function addScreen(screen) {
    if (getScreenByName(screen.name)) {
        console.log('id ' + screen.id + ' (name: '+ screen.name + ' ) already exist: not created');
        return false;
    }

    screensById.set(screen.id , screen);
    screensByName.set(screen.name , screen);
    screens.push(screen);


    screen.socket.emit('setName', screen.name);

    // Manage disconnection
    screen.socket.on('disconnect',  function() {
        onDisconnect(screen.socket);
    });

    listener.emit('changed');
    console.log('created: ' + screen.name + ' / ' + screen.id) ;
    return true;

}

export function getScreenById(id) {
    return screensById.get(id);
}

export function getScreenByName(name) {
    return screensByName.get(name);
}

function onDisconnect(socket) {
    console.log('disconnect: ' + socket.id);
    let screen = getScreenById(socket.id);
    if (screen) {
        console.log('shutdown: ' + screen.name + ' / ' + screen.id) ;
        listener.emit('changed');
        screen.online = false;
    };
    console.log(getScreenInfos());
}

export function updateScreen(screen) {
    let previousScreen = getScreenByName(screen.name);
    if (previousScreen) {

        console.log(screen.name + ' already existed');
        console.log('position: '+getPositionByName(screen.name));
        screens[getPositionByName(screen.name)] = screen;

        screensById.delete(previousScreen.id);
        screensById.set(screen.id , screen);

        screensByName.delete(screen.name);
        screensByName.set(screen.name , screen);

        listener.emit('changed');
        console.log('updated: ' + screen.name + ' / ' + screen.id) ;
        return true;
    }

    return false;
}

export function addOrUpdateScreen(screen) {

    // Check if already here
    if (!updateScreen(screen)) {

        addScreen(screen);

    }
}