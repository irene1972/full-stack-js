import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';

const registrar=async (req,res)=>{
    //console.log(req.body);
    const {email}=req.body;

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
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

const perfil=(req,res)=>{
    //console.log(req.veterinario);
    const {veterinario}=req;
    res.json({perfil:veterinario});
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
        res.json({msg:'Usuario confirmado correctamente'});
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
        res.json({msg:'Hemos enviado un email con las instrucciones'});
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
        return res.json({msg:'Password modificado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    resetPassword,
    comprobarToken,
    nuevoPassword
}