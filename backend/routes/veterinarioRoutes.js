import express from 'express';
import {
    registrar,
    perfil,
    confirmar,
    autenticar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router=express.Router();

//area pública
router.post('/',registrar);
router.get('/confirmar/:token',confirmar);
router.post('/login',autenticar);
router.post('/reset-password',resetPassword);
router.get('/reset-password/:token',comprobarToken);
router.post('/reset-password/:token',nuevoPassword);

//area privada
router.get('/perfil',checkAuth,perfil);
router.put('/perfil/:id',checkAuth,actualizarPerfil);
router.put('/actualizar-password/:id',checkAuth,actualizarPassword);

export default router;