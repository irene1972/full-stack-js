import express from 'express';
import {
    agregarPaciente,
    obtenerPacientes
} from '../controllers/pacienteController.js';

const router=express.Router();

/*
router.post('/',agregarPaciente);
router.get('/',obtenerPacientes);
*/
router.route('/')
    .post(agregarPaciente)
    .get(obtenerPacientes);


export default router;