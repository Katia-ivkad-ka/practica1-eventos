import mongoose from 'mongoose';

// Esquema: define qué campos tiene un recinto y sus reglas
const recintoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5
    },
    direccion: {
        type: String,
        required: true,
        minlength: 10
    },
    localidad: {
        type: String,
        required: true,
        minlength: 3
    },
    aforoMaximo: {
        type: Number
    }
});

// Modelo: el "objeto" con el que leeremos y guardaremos recintos en la BD
const Recinto = mongoose.model('recintos', recintoSchema);

export default Recinto;