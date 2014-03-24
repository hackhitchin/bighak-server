'use strict';

var EventEmitter = require('eventemitter').EventEmitter,

    pane = global.document.getElementById('qrcode'),
    qrimg = undefined;

function QRCodeUI() {
    var _this = this;

}

QRCodeUI.prototype = new EventEmitter();
QRCodeUI.prototype.contructor = QRCodeUI;


QRCodeUI.prototype.setcode = function (opts) {
    qrimg = document.getElementById('qr');
    qrimg.src = "/qrcode/" + opts.access_code + "/";

}


QRCodeUI.prototype.show = function () {
    pane.className = 'pane current';
};


QRCodeUI.prototype.stack = function () {
    pane.className = 'pane stacked';
};


module.exports = QRCodeUI;