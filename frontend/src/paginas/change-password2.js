import {imprimirAlerta,autenticarUsuario,cerrarSesion} from '../funciones.js';

(()=>{

    const tokenLS=autenticarUsuario();

    if(tokenLS){
        const header=document.querySelector('header');
        const nav=document.createElement('NAV');
        nav.innerHTML=`
            <a class="header" href="admin.html">Pacientes</a>
            <a class="header perfil" href="perfil.html">Perfil</a>
            <a class="header cerrar-sesion" href="#">Cerrar Sesión</a>
        `;
        header.appendChild(nav);

        const botonCerrarSesion=document.querySelector('.cerrar-sesion');
    
        botonCerrarSesion.addEventListener('click',cerrarSesion);
    }

    const formulario=document.querySelector('#form-reset2');

    const inputPassword5=document.querySelector('#inputPassword5');
    const inputPassword55=document.querySelector('#inputPassword55');

    formulario.addEventListener('submit',validarFormulario);

    function validarFormulario(e){
        e.preventDefault();
        const passwordActual=inputPassword5.value.trim();
        const passwordNuevo=inputPassword55.value.trim();
        if(!passwordActual || !passwordNuevo){
            imprimirAlerta('Los dos campos son obligatorios','error',formulario);
            return;
        }
        if(passwordActual === passwordNuevo){
            imprimirAlerta('Los dos campos deben ser diferentes','error',formulario);
            return;
        }
        if(passwordNuevo.length<6){
            imprimirAlerta('El nuevo password debe tener al menos 6 carácteres','error',formulario);
            return;
        }

        guardarPassword(passwordActual,passwordNuevo);
    }

    function guardarPassword(passwordActual,passwordNuevo){
        const token=autenticarUsuario();

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        const datos={
            passwordActual,
            passwordNuevo
        }
        //***************************** */
        
        fetch(`${import.meta.env.VITE_URL_API}/veterinarios/actualizar-password/${id}`, {
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
            imprimirAlerta(resultado.mensaje,'exito',formulario);
            inputPassword5.value='';
            inputPassword55.value='';
            
        })
        .catch(err => console.log(err));
        //***************************** */

    }

})()