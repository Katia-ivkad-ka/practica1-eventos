import mongoose from 'mongoose';

// 1) Esquema de las ENTRADAS (subdocumento)
const entradaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    disponibles: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'disponibles debe ser un número entero'
        }
    }
});

// 2) Esquema de los EVENTOS
const eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5
    },
    fecha: {
        type: Date,
        required: true
    },
    entradas: [entradaSchema],
    recinto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recintos',
        required: true
    }
});

const Evento = mongoose.model('eventos', eventoSchema);

export default Evento;