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
        screensWithoutSocket.push(getScreenWithoutSocket(screen));
    })
    return screensWithoutSocket;
}

export function getScreenWithoutSocket(screen) {
    let screenWithoutSocket = Object.assign({}, screen);
    delete screenWithoutSocket.socket;
    return screenWithoutSocket;
}

export function initScreen(screen) {
    screen.online = (screen.online !== undefined)?screen.online:false;
    screen.name = (screen.name !== undefined && screen.name.length > 0)?screen.name:getWord();
    screen.id = (screen.socket !== undefined)?screen.socket.id:Math.floor(Math.random() * 10000000000);
    screen.url = (screen.url !== undefined)?screen.url:'';
    if (screen.socket !== undefined) {
        screen.emit = screen.socket.emit.bind(screen.socket);
    } else {
        screen.emit = function() {};
    }
    if (screen.socket !== undefined) {
        screen.on = screen.socket.on.bind(screen.socket);
    } else {
        screen.on = function() {};
    }
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
    initScreen(screen);
    console.log('added: ' + screen.name + ' / ' + screen.id) ;
    if (getScreenByName(screen.name)) {
        console.log('id ' + screen.id + ' (name: '+ screen.name + ' ) already exist: not created');
        return false;
    }

    screensById.set(screen.id , screen);
    screensByName.set(screen.name , screen);
    screens.push(screen);

    screen.emit('setScreen', getScreenWithoutSocket(screen));

    // Manage disconnection
    screen.on('disconnect',  function() {
        onDisconnect(screen.socket);
    });

    console.log('before emit changed');
    listener.emit('changed');
    console.log('created: ' + screen.name + ' / ' + screen.id) ;
    console.log('infos: ' + getScreenInfos());
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
    console.log('infos: ' + getScreenInfos());
    listener.emit('changed');
}

export function updateScreen(screen) {
    let previousScreen = getScreenByName(screen.name);
    if (previousScreen) {

        console.log(screen.name + ' already existed');;

        // keep url
        screen.url = previousScreen.url;

        console.log('position: '+getPositionByName(screen.name));
        screens[getPositionByName(screen.name)] = screen;

        screensById.delete(previousScreen.id);
        screensById.set(screen.id , screen);

        screensByName.delete(screen.name);
        screensByName.set(screen.name , screen);

        listener.emit('changed');
        screen.emit('setScreen', getScreenWithoutSocket(screen));
        console.log('updated: ' + screen.name + ' / ' + screen.id) ;
        return true;
    }

    return false;
}

export function addOrUpdateScreen(screen) {
    console.log('addOrUpdateScreen: ' + screen.name + ' / ' + screen.id);
    // Check if already here
    if (!updateScreen(screen)) {

        addScreen(screen);

    }
}