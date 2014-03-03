/**
 * Created by robberwick on 23/02/14.
 */
var Instruction = require('../models/instruction');
/*
 * GET Instructions listing
 */

exports.list = function (req, res) {

    Instruction.find(function (err, instructions, count) {
        res.render('dashboard/list', {
            layout: "dashboard/dashboard-base",
            title: 'Instruction list',
            instructions: instructions
        });
    });


}

exports.send = function (req, res) {
    var access_code = req.body.access_code;
    Instruction.find({
        'access_code': access_code
    }, function (err, instructions, count) {
        console.log("sending: ", instructions);
        res.end(JSON.stringify({
            success: true
        }));
    })
}