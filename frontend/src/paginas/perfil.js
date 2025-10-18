import {cerrarSesion,autenticarUsuario,imprimirAlerta} from '../funciones.js';

(()=>{

    const botonCerrarSesion=document.querySelector('.cerrar-sesion');
    const formulario=document.querySelector('#form-veterinarios');

    const inputNombre=document.querySelector('#nombre');
    const inputEmail=document.querySelector('#email');
    const inputTelefono=document.querySelector('#telefono');
    const inputWeb=document.querySelector('#web');

    let veterinario={};

    botonCerrarSesion.addEventListener('click',cerrarSesion);
    formulario.addEventListener('submit',validarDatos);

    const token=autenticarUsuario();
        
    if(!token) return;
    
    fetch(`${import.meta.env.VITE_URL_API}/veterinarios/perfil`, {
    method: 'GET',
    headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
    }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        const {nombre,email,telefono,web,_id}=data;
        
        inputNombre.value=nombre;
        inputEmail.value=email;
        inputTelefono.value=telefono;
        inputWeb.value=web;
        const id=_id;

        veterinario=data;
    })
    .catch(error => console.error('Error:', error.message));

    function validarDatos(e){
        //console.log(e.target);
        e.preventDefault();
        const nombre=inputNombre.value.trim();
        const email=inputEmail.value.trim();
        const telefono=inputTelefono.value.trim();
        const web=inputWeb.value.trim();
        console.log(veterinario);
        if(!nombre || !email){
            imprimirAlerta('Los campos NOMBRE y EMAIL son obligatorios','error',formulario);
            return;
        }
        if(!veterinario._id){
            imprimirAlerta('Se ha producido un error','error',formulario);
            return;
        }
        veterinario.nombre=nombre;
        veterinario.email=email;
        veterinario.telefono=telefono;
        veterinario.web=web;
        //guardar datos en bd
        actualizarDatos();
    }
    function actualizarDatos(){
        console.log();
        const {_id,nombre,email,web,telefono}=veterinario;
        const datos={nombre,email,web,telefono};
        //{{API_URL}}/veterinarios/perfil/68efb4c952c1b85c051f17dc
        const token = autenticarUsuario();
        
        
        fetch(`${import.meta.env.VITE_URL_API}/veterinarios/perfil/${_id}`, {
        method: "PUT",
        body: JSON.stringify(datos),
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
        })
        .then(response => response.json())
        .then(resultado => {
            if(resultado.msg){
                imprimirAlerta(resultado.msg,'error',formulario);
                return;
            }
            imprimirAlerta('Ha sido actualizado con éxito','exito',formulario);

            //console.log(resultado);
            
        })
        .catch(err => console.log(err));

    }


})()