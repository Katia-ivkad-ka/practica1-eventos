import express from 'express';
import Evento from '../models/evento.js';
import Recinto from '../models/recinto.js';

const router = express.Router();

// GET /eventos -> todos los eventos, con los datos del recinto
router.get('/', async (req, res) => {
    try {
        const resultado = await Evento.find().populate('recinto');
        if (resultado.length > 0) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
        }
    } catch (error) {
        res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

// GET /eventos/localidad/:nombre -> eventos de una localidad que aún no han pasado
router.get('/localidad/:nombre', async (req, res) => {
    try {
        // 1) Buscamos los recintos de esa localidad
        const recintos = await Recinto.find({ localidad: req.params.nombre });
        // 2) Nos quedamos solo con sus ids
        const idsRecintos = recintos.map(recinto => recinto._id);
        // 3) Buscamos eventos en esos recintos con fecha de hoy en adelante
        const resultado = await Evento.find({
            recinto: { $in: idsRecintos },
            fecha: { $gte: new Date() }
        }).populate('recinto');

        if (resultado.length > 0) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

// GET /eventos/entradas/:idEvento/:tipoEntrada -> precio y disponibles de un tipo de entrada
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.idEvento);
        if (!evento)
            throw new Error("Evento no encontrado");

        const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
        if (!entrada)
            throw new Error("Tipo de entrada no encontrado");

        res.status(200).send({
            ok: true,
            resultado: { precio: entrada.precio, disponibles: entrada.disponibles }
        });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
    }
});

// PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad -> restar entradas disponibles
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        const cantidad = Number(req.params.cantidad);
        if (!Number.isInteger(cantidad) || cantidad <= 0)
            throw new Error("Cantidad no válida");

        const evento = await Evento.findById(req.params.idEvento);
        if (!evento)
            throw new Error("Evento no encontrado");

        const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
        if (!entrada)
            throw new Error("Tipo de entrada no encontrado");

        if (entrada.disponibles < cantidad)
            throw new Error("No hay suficientes entradas");

        entrada.disponibles -= cantidad;
        const resultado = await evento.save();
        res.status(200).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error actualizando entradas del evento " + req.params.idEvento });
    }
});

// GET /eventos/:id -> un evento por su id
router.get('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findById(req.params.id).populate('recinto');
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false, error: "Evento " + req.params.id + " no encontrado" });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "Evento " + req.params.id + " no encontrado" });
    }
});

// POST /eventos -> añadir un evento
router.post('/', async (req, res) => {
    try {
        const nuevoEvento = new Evento(req.body);
        const resultado = await nuevoEvento.save();
        res.status(201).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error añadiendo evento" });
    }
});

// PUT /eventos/:id -> actualizar un evento
router.put('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findByIdAndUpdate(req.params.id, req.body,
            { returnDocument: 'after', runValidators: true });
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false, error: "Error actualizando evento " + req.params.id });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error actualizando evento " + req.params.id });
    }
});

// DELETE /eventos/:id -> eliminar un evento
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findByIdAndDelete(req.params.id);
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false, error: "Error eliminando evento " + req.params.id });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error eliminando evento " + req.params.id });
    }
});

export default router;