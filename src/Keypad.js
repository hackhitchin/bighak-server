'use strict';


var EventEmitter = require('eventemitter').EventEmitter,
    KeypadUI = require('./ui/KeypadUI'),
    Program = require('./Program'),

    keyMap = {};


keyMap[KeypadUI.NUMBER_0] = 0;
keyMap[KeypadUI.NUMBER_1] = 1;
keyMap[KeypadUI.NUMBER_2] = 2;
keyMap[KeypadUI.NUMBER_3] = 3;
keyMap[KeypadUI.NUMBER_4] = 4;
keyMap[KeypadUI.NUMBER_5] = 5;
keyMap[KeypadUI.NUMBER_6] = 6;
keyMap[KeypadUI.NUMBER_7] = 7;
keyMap[KeypadUI.NUMBER_8] = 8;
keyMap[KeypadUI.NUMBER_9] = 9;
keyMap[KeypadUI.UP] = Program.FORWARD;
keyMap[KeypadUI.DOWN] = Program.BACKWARDS;
keyMap[KeypadUI.LEFT] = Program.ROTATE_LEFT;
keyMap[KeypadUI.RIGHT] = Program.ROTATE_RIGHT;
keyMap[KeypadUI.PAUSE] = Program.PAUSE;
keyMap[KeypadUI.PEWPEW] = Program.PEWPEW;


function Keypad() {
    var _this = this;

    this._ui = new KeypadUI();
    this._program = new Program();
    this._repeat = false;

    this._ui.on('click', function (e) {
        _this._handleKeyPress(e);
    });
}


Keypad.prototype = new EventEmitter();
Keypad.prototype.constructor = Keypad;


Keypad.prototype._handleKeyPress = function (key) {
    var command = keyMap[key];


    if (this._repeat) {
        // If repeating, expect number
        if (typeof command != 'number') return;

        this._program.repeat(command);
        this._repeat = false;
        this._ui.playSound(key);


    } else if (command) {
        // Add command to program

        try {
            this._program.add(command);
            this._ui.playSound(key);

        } catch (e) {
            return;
        }


    } else {
        // Function key

        switch (key) {
            case 'cm':
                this._program.reset();
                this._ui.playSound(key);
                break;

            case 'ce':
                try {
                    this._program.removeLast();
                    this._ui.playSound(key);
                } catch (e) {
                }
                break;

            case 'x2':
                this._repeat = true;
                this._ui.playSound(key);
                break;

            case 'test':
                // TODO: ?
                break;

            case 'tick':
                // TODO: ?
                break;

            case 'go':
                this._ui.playSound(key);
                this._sendProgram();
                break;

            case 'out':
                this.cancel();
                break;
        }
    }
}


Keypad.prototype._sendProgram = function () {
    var _this = this;
    var seq = this._program.stringify();

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "/create", true);

    xhr.onreadystatechange = function (aEvt) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200){
                var jsonResponse = JSON.parse(xhr.responseText);

                console.log(jsonResponse);
                history.pushState(jsonResponse, "bighak program " + jsonResponse.access_code, "/" + jsonResponse.access_code);

                _this.showcode(jsonResponse);
            }
            else {
                console.log("Error loading page\n");
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(JSON.stringify({
        driver_name: "Yuri Gagarin",
        instruction: seq
    }));
}


Keypad.prototype.show = function () {
    this._ui.show();
    this.emit('show');
}


Keypad.prototype.cancel = function () {
    this._ui.hide();
    this.emit('cancel');
}


Keypad.prototype.showcode = function(obj){
    console.log("showing code");
    this._ui.hide();
    this.emit('showcode', obj);
}

module.exports = Keypad;
