
var WelcomeUI = require('./ui/WelcomeUI'),
    Keypad = require('./Keypad'),
    instructions = require('./Instructions'),

    welcome = new WelcomeUI(),
    keypad = new Keypad();
    // instructions = new Instructions();
    // keypad = new Keypad();


welcome.on('click', function (button) {

    if (button == 'instructions') {
        instructions.show();
    } else {
        keypad.show();
    }

    welcome.stack();
});




// instructions.on('hide', function () {
//     welcome.show();
// });
//
//
//
//
keypad.on('hide', function () {
    welcome.show();
});
