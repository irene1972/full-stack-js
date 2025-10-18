import Paciente from '../models/Paciente.js';

const agregarPaciente=async(req,res)=>{
    
    const paciente=new Paciente(req.body);
    paciente.veterinario=req.veterinario._id;
    try {
        const pacienteAlmacenado=await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (e) {
        console.log(e);
        res.status(400).json({error:e.message});
    }
}

const obtenerPacientes=async (req,res)=>{
    
    const pacientes=await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes);
}

const obtenerPaciente=async (req,res)=>{
    const {id}=req.params;
    const paciente=await Paciente.findById(id);

    if(!paciente){
        return res.status(400).json({msg:'No existe el paciente'});
    }
    if( paciente.veterinario._id.toString() === req.veterinario._id.toString() ){
        res.json(paciente);
    }else{
        return res.status(400).json({msg:'Acción no válida'});
    }
}

const actualizarPaciente=async (req,res)=>{
    const {id}=req.params;
    const paciente=await Paciente.findById(id);

    if(!paciente){
        return res.status(400).json({msg:'No existe el paciente'});
    }
    if( paciente.veterinario._id.toString() === req.veterinario._id.toString() ){
        //actualizar paciente
        paciente.nombre=req.body.nombre || paciente.nombre;
        paciente.propietario=req.body.propietario || paciente.propietario;
        paciente.email=req.body.email || paciente.email;
        paciente.fecha=req.body.fecha || paciente.fecha;
        paciente.sintomas=req.body.sintomas || paciente.sintomas;

        try {
            const pacienteActualizado=await paciente.save();
            res.json(pacienteActualizado);
        } catch (error) {
            console.log(error);
            return res.json({msg:'No se pudo actualizar'});
        }

    }else{
        return res.status(400).json({msg:'Acción no válida'});
    }
}

const eliminarPaciente=async (req,res)=>{
    const {id}=req.params;
    const paciente=await Paciente.findById(id);

    if(!paciente){
        return res.status(400).json({error:'No existe el paciente'});
    }
    if( paciente.veterinario._id.toString() === req.veterinario._id.toString() ){
        
        //eliminar paciente
        try {
            await paciente.deleteOne();
            res.json({mensaje:'Paciente eliminado'});
        } catch (error) {
            console.log(error);
            return res.json({msg:'No se pudo eliminar'});
        }
    }else{
        return res.status(400).json({msg:'Acción no válida'});
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
    
}