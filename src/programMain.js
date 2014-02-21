
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

