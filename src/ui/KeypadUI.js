

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
