

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
