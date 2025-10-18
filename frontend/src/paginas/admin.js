import {imprimirAlerta,autenticarUsuario} from '../funciones.js';

(()=>{

    const botonCerrarSesion=document.querySelector('.cerrar-sesion');

    const inputNombre=document.querySelector('#nombre');
    const inputPropietario=document.querySelector('#propietario');
    const inputEmail=document.querySelector('#email');
    const inputFecha=document.querySelector('#fecha');
    const inputSintomas=document.querySelector('#sintomas');

    const formulario=document.querySelector('#form-pacientes');
    const divContenedor=document.querySelector('.container-flex');

    botonCerrarSesion.addEventListener('click',cerrarSesion);
    formulario.addEventListener('submit',validarForm);
    document.addEventListener('DOMContentLoaded',obtenerPacientes);

    function cerrarSesion(){
        localStorage.removeItem('token');
        window.location.replace(`${import.meta.env.VITE_URL_FRONTEND}/index.html`);
    }
    function validarForm(e){
        e.preventDefault();
        const nombre=inputNombre.value.trim();
        const propietario=inputPropietario.value.trim();
        const email=inputEmail.value.trim();
        const fecha=inputFecha.value.trim();
        const sintomas=inputSintomas.value.trim();

        const mascota={nombre,propietario,email,fecha,sintomas};
        
        if(!nombre || !propietario || !email || !sintomas){
            imprimirAlerta('Todos los campos (excepto fecha) son obligatorios','error',formulario);
            return;
        }
        //guardar datos mascota
        guardarDatosMascota(mascota);
    }

    function guardarDatosMascota(mascota){
        
        const token = autenticarUsuario();
        const datos={
            nombre:mascota.nombre,
            propietario:mascota.propietario,
            email:mascota.email,
            fecha:mascota.fecha,
            sintomas:mascota.sintomas
        };
        console.log(datos);
        
        fetch(`${import.meta.env.VITE_URL_API}/pacientes`, {
        method: "POST",
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
            imprimirAlerta('Ha sido guardado con éxito','exito',formulario);
            inputNombre.value='';
            inputPropietario.value='';
            inputEmail.value='';
            inputFecha.value='';
            inputSintomas.value='';
            
            console.log(resultado);
            
        })
        .catch(err => console.log(err));
    }

    function obtenerPacientes(){
        
        const token = autenticarUsuario();
        
        if(!token) return;
        
        fetch(`${import.meta.env.VITE_URL_API}/pacientes`, {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
        })
        .then(response => response.json())
        .then(data => {
            
            if(data.msg){
                imprimirAlerta(data.msg,'error',divContenedor);
                return;
            }
            if(data.length===0){
                const divPacientes=document.querySelector('div.pacientes');
                divPacientes.innerHTML=`<h2>No hay pacientes</h2>`;
            }
            const divPacientes=document.querySelector('div.pacientes');
            const h2=document.createElement('h2');
            h2.textContent='Listado de pacientes';
            divPacientes.append(h2);

            const lista=document.querySelector('ul.pacientes');
            
            lista.innerHTML='';
            
            data.forEach(paciente=>{
                const {nombre,propietario,email,fecha,sintomas,_id}=paciente;
                const formatearFecha=(fecha)=>{
                    const nuevaFecha=new Date(fecha);
                    return new Intl.DateTimeFormat('es',{dateStyle:'long'}).format(nuevaFecha);
                }
                
                lista.innerHTML+=`
                                    <li class="card">
                                        <p>NOMBRE: ${nombre}</p>
                                        <p>PROPIETARIO: ${propietario}</p>
                                        <p>EMAIL: ${email}</p>
                                        <p>FECHA: ${formatearFecha(fecha)}</p>
                                        <p>SINTOMAS: ${sintomas}</p>
                                        <button type="button" id="${_id}" class="btn btn-primary editar">Editar</button>
                                        <button type="button" id="${_id}" class="btn btn-primary eliminar">Eliminar</button>
                                    </li>`;
            });
            

        })
        .catch(error => console.error('Error:', error));
        
    }

})()