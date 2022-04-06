const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemperaturaSchema = Schema({
    temperatura: {
        type: Number,
        require: true,
        default: false
    },
    humedad: {
        type: Number,
        require: true,
        default: false
    },
    fecha: {
        type: Date,
        require: true,
        default: Date.now
    }
});

module.exports = mongoose.model("Temperaturas", TemperaturaSchema);