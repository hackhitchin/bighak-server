
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
