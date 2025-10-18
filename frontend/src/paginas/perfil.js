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

        if(!nombre || !email){
            imprimirAlerta('Los campos NOMBRE y EMAIL son obligatorios','error',formulario);
            return;
        }
        veterinario.nombre=nombre;
        veterinario.email=email;
        veterinario.telefono=telefono;
        veterinario.web=web;
        //guardar datos en bd
        actualizarDatos(veterinario);
    }
    function actualizarDatos(veterinario){
        console.log(veterinario);
    }


})()