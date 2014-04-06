var Instruction = require("../models/instruction");
var crypto = require("crypto");
var qrimage = require('qr-image');
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index.html', {
        welcome_class: "current"
    });
};

/*
 * GET keypad and program interface.
 */

exports.keypad = function (req, res) {
    res.render('keypad.html', {
        title: 'Program'
    });
};

/*
 * POST process and store submitted instruction
 */
exports.create = function (req, res) {

    var shasum = crypto.createHash('sha1');
    var command = req.body.instruction;
    var driver_name = req.body.driver_name;
    var access_code;

    //set content-type header
    res.setHeader('Content-Type', 'application/json');

    //generate a hash for the access code
    shasum.update(Date.now().toString() + Math.random() * 9999);

    access_code = shasum.digest('hex').substring(0, 7);

    // test command string against our regex
    if (!/^([FBLRPZ]{1}\d{1,2}){1,16}$/.test(command)) {
        // invalid post - send 400
        res.send(400);
    } else {
        new Instruction({
            command: command,
            access_code: access_code,
            driver_name: driver_name
        }).save(function (err, model) {
                if (err) {
                    // couldn't save the model
                    res.end(JSON.stringify({
                        success: false
                    }));
                }

                // return success and the model id
                res.end(JSON.stringify({
                    success: true,
                    access_code: access_code
                }));
            });


    }

};

//Generate a completion page for the access code
exports.retrieve = function (req, res) {
    var access_code = req.params[0]; //access code
    res.render(
        'index',
        {
            qrcode_class: "current",
            access_code: access_code
        }
    );
};

//Generate the QR code for the given access code
exports.qrcode = function (req, res) {
    var access_code = req.params[0]; //access code
    Instruction.findOne({
        'access_code': access_code
    }, function (err, instruction) {
        var code = qrimage.image(JSON.stringify(instruction), { type: 'svg' });
        res.type('svg');
        code.pipe(res);
    })

}