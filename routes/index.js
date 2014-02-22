var Instruction = require("../models/instruction");
var crypto = require("crypto");
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('home.html', { title: 'Welcome' });
};

/*
 * GET keypad and program interface.
 */

exports.keypad = function (req, res) {
    res.render('keypad.html', { title: 'Program' });
};

/*
* POST process and store submitted instruction
 */
exports.send = function (req, res) {

    var shasum = crypto.createHash('sha1');
    var command = req.body.instruction;

    //set content-type header
    res.setHeader('Content-Type', 'application/json');

    // test command string against our regex
    if (!/^([FBLRPZ]{1}\d{1,2}){1,16}$/.test(command)) {
        // invalid post - send 400
        res.send(400);
    } else {
        new Instruction({
            command: command
        }).save(function (err, model) {
                if (err){
                    // couldn't save the model
                    res.end(JSON.stringify({
                        success: false
                    }));
                }

                //generate a hash from the id
                shasum.update(model.id);

                // return success and the model id
                res.end(JSON.stringify({
                    success: true,
                    commandId: shasum.digest('hex').substring(0,7)
                }));
            });


    }

};