var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var instructionSchema = new Schema({
    driver_name: String,
    command:  String,
    access_code: String,
    postdate: {
        type: Date, default: Date.now
    }
});

module.exports = mongoose.model('Instruction', instructionSchema);
