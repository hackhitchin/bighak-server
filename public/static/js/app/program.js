(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){


'use strict';


var buttons = global.document.querySelectorAll('.btn');




function Keypad () {
}




Keypad.prototype.addKeyPressListener = function (listener) {
	var callback, button, i;

	callback = function (e) {
		listener(this.id);
	};

	for (i = 0; button = buttons[i]; i++) {
		button.addEventListener('click', callback);
	}
}




module.exports = Keypad;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){

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
	return this._sequence;
};




module.exports = Program;

},{}],3:[function(require,module,exports){
(function (global){

'use strict';


var Keypad = require('./Keypad'),
	Program = require('./Program'),

	keypad = new Keypad(),
	program = new Program(),
	repeat = false,

	keyMap = {
		btn0: 0,
		btn1: 1,
		btn2: 2,
		btn3: 3,
		btn4: 4,
		btn5: 5,
		btn6: 6,
		btn7: 7,
		btn8: 8,
		btn9: 9,
		up: Program.FORWARD,
		down: Program.BACKWARDS,
		left: Program.ROTATE_LEFT,
		right: Program.ROTATE_RIGHT,
		pause: Program.PAUSE,
		pewpew: Program.PEWPEW
	};




function handleKeyPress (key) {
	var command = keyMap[key];

	if (repeat) {
		// If repeating, expect number
		if (typeof command != 'number') {
			console.log('TODO: Bad things.');
		}

		program.repeat(command);
		repeat = false;


	} else if (command) {
		// Add command to program

		try {
			program.add(command);
		
		} catch (e) {
			if (e instanceof TypeError) {
				console.log('TODO: Play bad noise');
			}
		}


	} else {
		// Function key

		switch (key) {
			case 'cm':
				program.reset();
				break;

			case 'ce':
				program.removeLast();
				break;

			case 'x2':
				repeat = true;
				break;

			case 'test':
				// TODO: ?
				break;

			case 'tick':
				// TODO: ?
				break;

			case 'go':
				sendProgram();
				break;
		}

	}
}




function sendProgram () {
	var seq = program.stringify();
	global.alert(seq);	// TODO: Something better than this.
}




keypad.addKeyPressListener(handleKeyPress);


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Keypad":1,"./Program":2}]},{},[3])