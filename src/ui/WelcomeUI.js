

'use strict';


var EventEmitter = require('eventemitter').EventEmitter,

    pane = global.document.getElementById('welcome'),
    buttons = pane.querySelectorAll('button');




function WelcomeUI () {
    var _this = this,
        callback, button, i;

    callback = function (e) {
        _this.emit('click', this.getAttribute('data-value'));
    };

    for (i = 0; button = buttons[i]; i++) {
        button.addEventListener('click', callback);
    }
}


WelcomeUI.prototype = new EventEmitter();
WelcomeUI.prototype.contructor = WelcomeUI;




WelcomeUI.prototype.show = function () {
    pane.className = 'pane current';
}




WelcomeUI.prototype.stack = function () {
    pane.className = 'pane stacked';
}




module.exports = WelcomeUI;
