var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var instructionSchema = new Schema({
    command:  String,
    postdate: {
        type: Date, default: Date.now
    }
});

module.exports = mongoose.model('Instruction', instructionSchema);
