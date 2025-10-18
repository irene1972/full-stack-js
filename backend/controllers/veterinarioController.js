import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailResetPass from '../helpers/emailResetPassword.js';

const registrar=async (req,res)=>{
    const {email,nombre}=req.body;

    //revisar si un usuario que quiere registrarse tiene el email duplicado
    const existeUsuario=await Veterinario.findOne({email});
    if(existeUsuario){
        const error=new Error('Ya existe el usuario en bd');
        return res.status(400).json({msg:error.message});
    }

    try {
        //guardar un nuevo veterinario
        const veterinario=new Veterinario(req.body);
        const veterinarioGuardado=await veterinario.save();

        //enviar el email
        emailRegistro({email,nombre,token:veterinarioGuardado.token});

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

const perfil=(req,res)=>{
    //console.log(req.veterinario);
    const {veterinario}=req;
    res.json(veterinario);
};

const confirmar=async(req,res)=>{
    const {token}=req.params;

    const usuarioConfirmar=await Veterinario.findOne({token});
    if(!usuarioConfirmar){
        const error=new Error('Token no válido');
        return res.status(404).json({msg:error.message});
    }
    try {
        usuarioConfirmar.token=null;
        usuarioConfirmar.confirmado=true;
        await usuarioConfirmar.save();
        res.json({mensaje:'Usuario confirmado correctamente'});
    } catch (error) {
        console.log(error);
    }
    
    
};

const autenticar=async(req,res)=>{
    const {email,password}=req.body;
    const usuario=await Veterinario.findOne({email});
    if(!usuario){
        const error=new Error('El usuario no existe')
        return res.status(403).json({msg:error.message});
    }
    if(!usuario.confirmado){
        const error=new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg:error.message});
    }
    if(await usuario.comprobarPassword(password)){
        //console.log(usuario);
        res.json({token:generarJWT(usuario.id)});
    }else{
        const error=new Error('El password es incorrecto')
        return res.status(403).json({msg:error.message});
    }
}

const resetPassword=async(req,res)=>{
    
    const {email}=req.body;
    const usuario=await Veterinario.findOne({email});
    if(!usuario){
        const error=new Error('El usuario no existe');
        return res.status(404).json({msg:error.message});
    }
    try {
        usuario.token=generarId();
        await usuario.save();

        //enviar email
        //recuperamos datos del veterinario para enviar el email
        const usuarioVet=await Veterinario.findOne({email});
        const {nombre,token}=usuarioVet;
        emailResetPass({email,nombre,token});

        res.json({mensaje:'Hemos enviado un email con las instrucciones'});
    } catch (error) {
        console.log(error);
    }

}

const comprobarToken=async (req,res)=>{
    const {token}=req.params;
    const usuario=await Veterinario.findOne({token});
    if(!token || !usuario){
        const error=new Error('Token no válido');
        return res.status(404).json({msg:error.message});
    }

    return res.json({msg:'Token válido y el usuario existe'});

}

const nuevoPassword=async (req,res)=>{
    
    const {token}=req.params;
    const {password}=req.body;
    const usuario=await Veterinario.findOne({token});
    if(!token || !usuario){
        const error=new Error('Token no válido');
        return res.status(404).json({msg:error.message});
    }
    try {
        usuario.token=null;
        usuario.password=password;
        await usuario.save();
        return res.json({mensaje:'Password modificado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil=async (req,res)=>{
    const id=req.params.id;
    const veterinario=await Veterinario.findById(id);

    if(!veterinario){
        return res.status(400).json({msg:'No existe el usuario'});
    }
    //validamos que el usuario no pretenda cambiar el email por el de otro usuario
    const {email}=req.body;
    if(veterinario.email !== email){
        const existeEmail=await Veterinario.findOne({email});
        if(existeEmail){
            const error=new Error('Ese email ya está registrado');
            return res.status(400).json({msg:error.message});
        }
    }

    try {
        //actualizar veterinario
        veterinario.nombre=req.body.nombre;
        veterinario.telefono=req.body.telefono;
        veterinario.email=req.body.email;
        veterinario.web=req.body.web;

        const veterinarioActualizado=await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'No se pudo actualizar'});
    }
}

const actualizarPassword=async(req,res)=>{
    console.log(req.params.id);
    console.log(req.body);
    //leer los datos
    const id=req.params.id;
    const {passwordActual,passwordNuevo}=req.body;

    //comprobar que el veterinario exista
    const veterinario=await Veterinario.findById(id);
    if(!veterinario){
        return res.status(400).json({msg:'No existe el usuario'});
    }

    //comprobar su password
    if(await veterinario.comprobarPassword(passwordActual)){
        veterinario.password=passwordNuevo;
        //almacenar su nuevo password
        await veterinario.save();
        return res.json({mensaje:'Password almacenado correctamente'});
    }else{
        return res.status(400).json({msg:'El password actual es incorrecto'});
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}