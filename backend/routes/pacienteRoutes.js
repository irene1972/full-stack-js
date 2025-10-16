import express from 'express';
import {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from '../controllers/pacienteController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router=express.Router();

/*
router.post('/',agregarPaciente);
router.get('/',obtenerPacientes);
*/

router
    .route('/')
    .post(checkAuth,agregarPaciente)
    .get(checkAuth,obtenerPacientes);

router  
    .route('/:id')
    .get(checkAuth,obtenerPaciente)
    .put(checkAuth,actualizarPaciente)
    .delete(checkAuth,eliminarPaciente);

export default router;