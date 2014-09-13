'use strict';

var EventEmitter = require('eventemitter').EventEmitter,

    pane = global.document.getElementById('qrcode'),
    backButton = global.document.getElementById('btn-back'),
    qrimg = undefined;

function QRCodeUI() {
    var _this = this,
    callback = function (e) {
        _this.emit('hidecode', this.id);
    };

    backButton.addEventListener('click', callback);

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

QRCodeUI.prototype.hide = function () {
    pane.className = 'pane';
}

QRCodeUI.prototype.stack = function () {
    pane.className = 'pane stacked';
};


module.exports = QRCodeUI;