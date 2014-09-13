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