(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(exports) {
  var process = { EventEmitter: function() {} };
  
  if (typeof Array.isArray !== "function"){
    Array.isArray = function(obj){ return Object.prototype.toString.call(obj) === "[object Array]" };
  }
  
  if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(item){
        for ( var i = 0, length = this.length; i < length; i++ ) {
            if ( this[ i ] === item ) {
                return i;
            }
        }

        return -1;
    };
  }
  
  // Begin wrap of nodejs implementation of EventEmitter

  var EventEmitter = exports.EventEmitter = process.EventEmitter;

  var isArray = Array.isArray;

  EventEmitter.prototype.emit = function(type) {
    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      if (!this._events || !this._events.error ||
          (isArray(this._events.error) && !this._events.error.length))
      {
        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    if (!this._events) return false;
    var handler = this._events[type];
    if (!handler) return false;

    if (typeof handler == 'function') {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          var args = Array.prototype.slice.call(arguments, 1);
          handler.apply(this, args);
      }
      return true;

    } else if (isArray(handler)) {
      var args = Array.prototype.slice.call(arguments, 1);

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
      return true;

    } else {
      return false;
    }
  };

  // EventEmitter is defined in src/node_events.cc
  // EventEmitter.prototype.emit() is also defined there.
  EventEmitter.prototype.addListener = function(type, listener) {
    if ('function' !== typeof listener) {
      throw new Error('addListener only takes instances of Function');
    }

    if (!this._events) this._events = {};

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    } else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);
    } else {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }

    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function(type, listener) {
    var self = this;
    self.on(type, function g() {
      self.removeListener(type, g);
      listener.apply(this, arguments);
    });
  };

  EventEmitter.prototype.removeListener = function(type, listener) {
    if ('function' !== typeof listener) {
      throw new Error('removeListener only takes instances of Function');
    }

    // does not use listeners(), so no side effect of creating _events[type]
    if (!this._events || !this._events[type]) return this;

    var list = this._events[type];

    if (isArray(list)) {
      var i = list.indexOf(listener);
      if (i < 0) return this;
      list.splice(i, 1);
      if (list.length == 0)
        delete this._events[type];
    } else if (this._events[type] === listener) {
      delete this._events[type];
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function(type) {
    // does not use listeners(), so no side effect of creating _events[type]
    if (type && this._events && this._events[type]) this._events[type] = null;
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if (!this._events) this._events = {};
    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  // End nodejs implementation
}((typeof exports === 'undefined') ? window : exports));
},{}],2:[function(require,module,exports){


var ui = {};

module.exports = {
    show: ui.show,
    hide: ui.hide
};

},{}],3:[function(require,module,exports){
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


    } else if (key in keyMap) {
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
    this._ui.hide();
    this.emit('showcode', obj);
}

Keypad.prototype.reset = function() {
    history.pushState({}, 'Home', '/');
    this._program.reset()
}

module.exports = Keypad;

},{"./Program":4,"./ui/KeypadUI":6,"eventemitter":1}],4:[function(require,module,exports){

'use strict';


function Program () {
	this.reset();
}


Program.FORWARD = 'F';
Program.BACKWARDS = 'B';
Program.ROTATE_LEFT = 'L';
Program.ROTATE_RIGHT = 'R';
Program.PAUSE = 'P';
Program.PEWPEW = 'Z';

Program.COMMANDS = [Program.FORWARD, Program.BACKWARDS, Program.ROTATE_LEFT,
					Program.ROTATE_RIGHT, Program.PAUSE, Program.PEWPEW];




Program.prototype.add = function (command) {
	if (typeof command == 'string') {
		if (Program.COMMANDS.indexOf(command) < 0) throw new ReferenceError('Invalid command');
		if (/[FBLRPZ]$/.test(this._sequence)) throw new TypeError('Invalid sequence');

	} else if (typeof command == 'number') {
		if (!this._sequence) throw new TypeError('Invalid sequence');
		if (/\d\d$/.test(this._sequence)) throw new TypeError('Invalid sequence');
		if (/Z\d$/.test(this._sequence)) throw new TypeError('Invalid sequence');

	} else {
		throw new ReferenceError('Invalid command');
	}

	this._sequence += command;
};




Program.prototype.removeLast = function () {
	if (!this._sequence) throw new TypeError ('Invalid when no instructions set');

	var commands = this._sequence.split(/(?=[FBLRPZ])/);
	commands.pop();

	this._sequence = commands.join('');
};




Program.prototype.reset = function () {
	this._sequence = '';
};




Program.prototype.repeat = function (count) {
	var commands = this._sequence.split(/(?=[FBLRPZ])/),
		repeated;

	count = Math.min(count, commands.length);
	repeated = commands.slice(commands.length - count);

	commands.push.apply(commands, repeated);
	this._sequence = commands.join('');
};




Program.prototype.stringify = function () {
    var commands = this._sequence.split(/(?=[FBLRPZ])/),
        i,
        seqArray = [];

    for(i=0; i < commands.length; i++){
        seqArray[i] = (commands[i].length === 2) ? commands[i][0] + '0' + commands[i][1] : commands[i];
    }
	return seqArray.join('');
};




module.exports = Program;

},{}],5:[function(require,module,exports){
var WelcomeUI = require('./ui/WelcomeUI'),
    Keypad = require('./Keypad'),
    instructions = require('./Instructions'),
    QRCodeUI = require('./ui/QRCodeUI'),

    welcome = new WelcomeUI(),
    keypad = new Keypad(),
    qrcode = new QRCodeUI();


welcome.on('click', function (button) {

    if (button == 'instructions') {
        instructions.show();
    } else {
        keypad.show();
    }

    welcome.stack();
});


keypad.on('cancel', function () {
    welcome.show();
});

keypad.on('showcode', function (opts) {

    qrcode.setcode(opts);
    qrcode.show();
});

qrcode.on('hidecode', function(){
    keypad.reset();
    qrcode.hide();
    welcome.show();
})
},{"./Instructions":2,"./Keypad":3,"./ui/QRCodeUI":7,"./ui/WelcomeUI":8}],6:[function(require,module,exports){
(function (global){


'use strict';


var EventEmitter = require('eventemitter').EventEmitter,

	pane = global.document.getElementById('keypad'),
	buttons = pane.querySelectorAll('.btn'),
	audio = {
		key03: global.document.getElementById('audio-key-0-3'),
		key46: global.document.getElementById('audio-key-4-6'),
		key79: global.document.getElementById('audio-key-7-9'),
		keyCommand: global.document.getElementById('audio-key-command'),
		start: global.document.getElementById('audio-start')
	};




function KeypadUI () {
	var _this = this,
		callback, button, i;

	callback = function (e) {
		_this.emit('click', this.id);
	};

	for (i = 0; button = buttons[i]; i++) {
		button.addEventListener('click', callback);
	}
}


KeypadUI.prototype = new EventEmitter();
KeypadUI.prototype.contructor = KeypadUI;


KeypadUI.NUMBER_0 = 'btn0';
KeypadUI.NUMBER_1 = 'btn1';
KeypadUI.NUMBER_2 = 'btn2';
KeypadUI.NUMBER_3 = 'btn3';
KeypadUI.NUMBER_4 = 'btn4';
KeypadUI.NUMBER_5 = 'btn5';
KeypadUI.NUMBER_6 = 'btn6';
KeypadUI.NUMBER_7 = 'btn7';
KeypadUI.NUMBER_8 = 'btn8';
KeypadUI.NUMBER_9 = 'btn9';
KeypadUI.UP = 'up';
KeypadUI.DOWN = 'down';
KeypadUI.LEFT = 'left';
KeypadUI.RIGHT = 'right';
KeypadUI.PAUSE = 'pause';
KeypadUI.PEWPEW = 'pewpew';




KeypadUI.prototype.show = function () {
	pane.className = 'pane current';
}




KeypadUI.prototype.hide = function () {
	pane.className = 'pane';
}




KeypadUI.prototype.stack = function () {
	pane.className = 'pane stacked';
}




KeypadUI.prototype.playSound = function (key) {
	var file;

	switch (key) {
		case KeypadUI.NUMBER_0:
		case KeypadUI.NUMBER_1:
		case KeypadUI.NUMBER_2:
		case KeypadUI.NUMBER_3:
			file = audio.key03;
			break;

		case KeypadUI.NUMBER_4:
		case KeypadUI.NUMBER_5:
		case KeypadUI.NUMBER_6:
			file = audio.key46;
			break;

		case KeypadUI.NUMBER_7:
		case KeypadUI.NUMBER_8:
		case KeypadUI.NUMBER_9:
			file = audio.key79;
			break;

		case 'cm':
		case 'ce':
		case 'x2':
		case 'pewpew':
		case 'pause':
		case 'out':
		case 'up':
		case 'down':
		case 'left':
		case 'right':
			file = audio.keyCommand;
			break;

		case 'go':
			file = audio.start;
			break;
	}

	if (file) file.play();
}




module.exports = KeypadUI;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"eventemitter":1}],7:[function(require,module,exports){
(function (global){
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
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"eventemitter":1}],8:[function(require,module,exports){
(function (global){


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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"eventemitter":1}]},{},[5])