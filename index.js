//const mongoose = require('mongoose').set('debug', true);
const mongoose = require('mongoose');
const urlMongoAtlas = "mongodb+srv://admin:p7Cx4JSEe3WZeB4@cluster0.qmwhh.mongodb.net/raspberry";
const express = require("express");
const cors = require('cors');
const path = require('path');

const app = express();

//Para poder recibir jsons
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'   //Poner aquí el dominio Heroku cuando lo suba
}));

//Para conectar a mongo y abrir el servidor
mongoose.connect(urlMongoAtlas, 
    { useNewUrlParser: true, 
      useunifiedtopology: true }, 
    (err, res) => {
    try {
        if (err) 
            throw err;
        else {
            console.log("Conectado correctamente a Mongo Atlas");
            //Abrimos el servidor Express si se ha podido conectar a Mongo
            const PORT = process.env.PORT || 4000;
            app.listen(PORT, () => {
                console.log(`Servidor corriendo en puerto: ${ PORT }`);
            });
        }
    } catch (err) {
        console.log(err);
    }
});


//Sacar los datos de todas las temperaturas
async function temperaturas( req, res) {
    try {
        const temperaturas = await Temperaturas.find().sort({ fecha: -1 });
        if(!temperaturas)
            res.status(400).send({ msg: "Error al obtener temperaturas" });
        else {
            res.status(200).send(temperaturas);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

//Sacar los datos de todas las temperaturas en una fecha
async function temperaturasFecha( req, res) {
    const fechaT = req.params.fecha;
    try {
        const temperaturas = await Temperaturas.find({ fecha: { $gte: new Date(fechaT).setHours(0, 0, 0, 0), $lte: new Date(fechaT).setHours(23, 59, 59, 0) } } ).sort({ fecha: 1 });
        //console.log(temperaturas);
        if(!temperaturas)
            res.status(400).send({ msg: "Error al obtener temperaturas" });
        else {
            res.status(200).send(temperaturas);
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

//Sacar los datos de todas las temperaturas en un rango de fechas
async function temperaturasRangoFecha( req, res) {
    const fechaStart = req.params.fechaStart;
    const fechaFinish = req.params.fechaFinish;
    try {
        const temperaturas = await Temperaturas.find({ fecha: { $gte: new Date(fechaStart), $lte: new Date(fechaFinish) } }).sort({ fecha: 1 });
        //console.log(temperaturas);
        if(!temperaturas)
            res.status(400).send({ msg: "Error al obtener temperaturas" });
        else {
            res.status(200).send(temperaturas);
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

//Consultar estado del actuador
async function consultarActuador( req, res) {
    try {
        const actuador = await Actuadores.find({ name: 'actuador1' });
        //console.log(temperaturas);
        if(!actuador)
            res.status(400).send({ msg: "Error al obtener actuador" });
        else {
            res.status(200).send(actuador);
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

//Cambiar estado del actuador
async function cambiarActuador( req, res) {
    let estado = req.params.estado;

    try {
        const actuador = await Actuadores.find({ name: 'actuador1' });
        //console.log(temperaturas);
        if(!actuador)
            res.status(400).send({ msg: "Error al cambiar estado" });
        else {
            let actuadorUpdate = await Actuadores.findOneAndUpdate({ name: 'actuador1' }, { state: estado });
            res.status(200).send(actuadorUpdate);
        }

    } catch (error) {
        res.status(500).send(error);
    }

}


//Modelo
const Temperaturas = require("./temperaturas");
const Actuadores = require("./actuadores");

//Router
const api = express.Router();
app.get('/temperaturas', temperaturas);
app.get('/temperaturas/:fecha', temperaturasFecha);
app.get('/temperaturas/:fechaStart/:fechaFinish', temperaturasRangoFecha);
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/actuador/:estado', cambiarActuador);
app.get('/actuador', consultarActuador);

