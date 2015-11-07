/* global io, webSocketPort */

'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.on = on;
exports.off = off;
exports.emit = emit;
exports.send = send;
exports.create = create;
var socket = undefined;

function on() {
    var _socket;

    return (_socket = socket).on.apply(_socket, arguments);
}

function off() {
    var _socket2;

    return (_socket2 = socket).off.apply(_socket2, arguments);
}

function emit() {
    var args = arguments;
    console.log('webSocket [emit]', args);

    return new _Promise(function (resolve, reject) {
        var _socket3;

        var resolved = undefined;
        (_socket3 = socket).emit.apply(_socket3, args.concat([function (err, result) {
            clearTimeout(resolved);
            console.log('webSocket [emit response]', arguments);
            if (err !== null) {
                reject(err);
            } else {
                resolve(result);
            }
        }]));
        resolved = setTimeout(function () {
            console.log('webSocket [emit timeout]', args);
            reject(new Error('Timeout'));
        }, 10000);
    });
}

function send() {
    var _socket4;

    return (_socket4 = socket).send.apply(_socket4, arguments);
}

function create() {
    return new _Promise(function (resolve, reject) {
        socket = io('http://' + window.location.hostname + ':' + webSocketPort, {
            transports: ['websocket', 'polling', 'flashsocket'],
            reconnectionDelay: 500,
            reconnectionDelayMax: 3000,
            timeout: 2000
        });

        socket.on('connect', function () {
            resolve();
        });
    });
}
//# sourceMappingURL=webSocket.js.map
