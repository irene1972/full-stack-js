import {imprimirAlerta} from '../funciones.js';

(()=>{

const botonRegistrar=document.querySelector('#registrar');
const contenedorBotones=document.querySelector('.botones');
const contenedorLogin=document.querySelector('#resul');

botonRegistrar.addEventListener('click',abrirFormulario);

function abrirFormulario(){
    contenedorBotones.remove();
    contenedorLogin.innerHTML=`
    <form id="form-registrar">
        <div class="mb-3">
            <label for="inputNombre3" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="inputNombre3">
        </div>
        <div class="mb-3">
            <label for="inputEmail3" class="form-label">Email address</label>
            <input type="email" class="form-control" id="inputEmail3" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">Nosotros nunca compartiremos tu email con nadie</div>
        </div>
        <div class="mb-3">
            <label for="inputTelefono3" class="form-label">Telefono</label>
            <input type="tel" class="form-control" id="inputTelefono3">
        </div>
        <div class="mb-3">
            <label for="inputWeb3" class="form-label">Web</label>
            <input type="text" class="form-control" id="inputWeb3">
        </div>
        <div class="mb-3">
            <label for="inputPassword3" class="form-label">Password</label>
            <input type="password" class="form-control" id="inputPassword3">
        </div>
        <div class="mb-3">
            <label for="inputPassword33" class="form-label">Repita Password</label>
            <input type="password" class="form-control" id="inputPassword33">
        </div>
        <button type="submit" class="btn btn-primary">Registrarse</button>
    </form>
    `;
    const formulario=document.querySelector('#form-registrar');
    formulario.onsubmit=(e)=>{
        e.preventDefault();
        const form=e.target;
        registrar(form);

    }
}

function registrar(form){
    const inputNombre=form.querySelector('#inputNombre3');
    const inputEmail=form.querySelector('#inputEmail3');
    const inputTelefono=form.querySelector('#inputTelefono3');
    const inputWeb=form.querySelector('#inputWeb3');
    const inputPassword=form.querySelector('#inputPassword3');
    const inputRepitaPassword=form.querySelector('#inputPassword33');

    const nombre=inputNombre.value.trim();
    const email=inputEmail.value.trim();
    const telefono=inputTelefono.value.trim();
    const web=inputWeb.value.trim();
    const password=inputPassword.value.trim();
    const repitaPassword=inputRepitaPassword.value.trim();

    if(password !== repitaPassword){
        imprimirAlerta('Los dos passwords deben ser iguales','error',form);
        return;
    }
    if(!nombre || !email || !password){
        imprimirAlerta('Los campos NOMBRE, EMAIL y PASSWORD son obligatorios','error',form);
        return;
    }
    const datos={nombre,email,telefono,web,password};
    
    fetch(`${import.meta.env.VITE_URL_API}/veterinarios`, {
    method: "POST",
    body: JSON.stringify(datos),
    headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json())
    .then(resultado => {
        if(resultado.msg){
            imprimirAlerta(resultado.msg,'error',form);
            return;
        }
        imprimirAlerta('Ha sido registrado con éxito, revise su email','exito',form);
        inputNombre.value='';
        inputEmail.value='';
        inputTelefono.value='';
        inputWeb.value='';
        inputPassword.value='';
        console.log(resultado);
        
    })
    .catch(err => console.log(err));
}
})()