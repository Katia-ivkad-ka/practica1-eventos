// 1) Cargar librerías
import express from 'express';
import mongoose from 'mongoose';
import recintosRouter from './routes/recintos.js';
import eventosRouter from './routes/eventos.js';

const PORT = process.env.PORT || 8080;

// 2) Conectar con la base de datos
try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'eventos' });
    console.log('Conectado a MongoDB');
} catch (error) {
    console.log('Error conectando a MongoDB:', error.message);
}

// 3) Crear el servidor Express y activar el middleware JSON
const app = express();
app.use(express.json());

// 4) Cargar los enrutadores
app.use('/recintos', recintosRouter);
app.use('/eventos', eventosRouter);

// 5) Poner en marcha el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});