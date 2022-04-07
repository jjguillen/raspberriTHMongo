const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActuadorSchema = Schema({
    name: {
        type: String,
        require: true,
        default: 'actuador1'
    },
    state: {
        type: String,
        require: true,
        default: 'cerrado'
    }
});

module.exports = mongoose.model("Actuadores", ActuadorSchema);