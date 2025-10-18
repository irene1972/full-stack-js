import {imprimirAlerta,autenticarUsuario,formatearFecha} from '../funciones.js';

(()=>{
    let pacienteEditado={};

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

    inputNombre.addEventListener('keyup',actualizarNombrePacienteEditado);
    inputPropietario.addEventListener('keyup',actualizarPropietarioPacienteEditado);
    inputEmail.addEventListener('keyup',actualizarEmailPacienteEditado);
    inputFecha.addEventListener('focusout',actualizarFechaPacienteEditado);
    inputSintomas.addEventListener('keyup',actualizarSintomasPacienteEditado);

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
        if(!pacienteEditado.id){
            guardarDatosMascota(mascota);
            return;
        }
        //actualiza el objeto pacienteEditado
        pacienteEditado.nombre=nombre;
        pacienteEditado.propietario=propietario;
        pacienteEditado.email=email;
        pacienteEditado.sintomas=sintomas;

        modificarDatosMascota();
        
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
        //console.log(datos);
        
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
            
            let botonEditar='';

            data.forEach(paciente=>{
                const {nombre,propietario,email,fecha,sintomas,_id}=paciente;
                
                lista.innerHTML+=`
                                    <li class="card">
                                        <p>NOMBRE: ${nombre}</p>
                                        <p>PROPIETARIO: ${propietario}</p>
                                        <p>EMAIL: ${email}</p>
                                        <p>FECHA: ${formatearFecha(fecha)}</p>
                                        <p>SINTOMAS: ${sintomas}</p>
                                        <button type="button" id="${_id}" class="btn btn-primary editar">Editar</button>
                                        <button type="button" id="${_id}" class="btn btn-primary eliminar">Eliminar</button>
                                    </li>
                                    `;
                botonEditar=document.querySelector(`button.editar`);
                botonEditar.onclick=(e)=>console.log(e.target);
                //botonEditar.onclick=(e)=>{editarPaciente(e);}
                
            });
            

        })
        .catch(error => console.error('Error:', error));
        
    }

    function editarPaciente(e){
        
        const id=e.target.getAttribute('id');
        const token = autenticarUsuario();
        
        if(!token) return;
        
        fetch(`${import.meta.env.VITE_URL_API}/pacientes/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            const {nombre,propietario,email,fecha,sintomas,_id}=data;
            
            inputNombre.value=nombre;
            pacienteEditado.nombre=nombre;
            inputPropietario.value=propietario;
            pacienteEditado.propietario=propietario;
            inputEmail.value=email;
            pacienteEditado.email=email;
            //inputFecha.value=formatearFecha(Date.parse(fecha));
            inputSintomas.value=sintomas;
            pacienteEditado.sintomas=sintomas;
            pacienteEditado.id=_id;
        })
        .catch(error => console.error('Error:', error.message));
        
    }
    function modificarDatosMascota(){
        const token = autenticarUsuario();
        const {nombre,propietario,email,fecha,sintomas,id}=pacienteEditado;
        const datos={
            nombre,
            propietario,
            email,
            fecha,
            sintomas
        };
        console.log(`${import.meta.env.VITE_URL_API}/pacientes/${id}`);
        console.log(pacienteEditado);
        console.log(token);
        
        fetch(`${import.meta.env.VITE_URL_API}/pacientes/${id}`, {
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
            inputNombre.value='';
            inputPropietario.value='';
            inputEmail.value='';
            inputFecha.value='';
            inputSintomas.value='';
            
            console.log(resultado);

            obtenerPacientes={};
            
        })
        .catch(err => console.log(err));

    }
    function eliminarPaciente(e){
        console.log(e.target);
    }
    function actualizarNombrePacienteEditado(e){
        obtenerPacientes.nombre=e.target.value;
    }
    function actualizarPropietarioPacienteEditado(){
        obtenerPacientes.propietario=e.target.value;
    }
    function actualizarEmailPacienteEditado(){
        obtenerPacientes.email=e.target.value;
    }
    function actualizarFechaPacienteEditado(e){
        obtenerPacientes.fecha=e.target.value;
    }
    function actualizarSintomasPacienteEditado(){
        obtenerPacientes.sintomas=e.target.value;
    }

})()