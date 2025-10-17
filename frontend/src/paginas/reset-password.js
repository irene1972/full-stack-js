import {imprimirAlerta} from '../funciones.js';

(()=>{

const botonReset=document.querySelector('#reset-password');
const contenedorBotones=document.querySelector('.botones');
const contenedorReset=document.querySelector('#resul');
const inputEmail=document.querySelector('#inputEmail1');

botonReset.addEventListener('click',abrirFormulario);

function abrirFormulario(){
    contenedorBotones.remove();
    contenedorReset.innerHTML=`
    <form id="form-reset">
        <div class="mb-3 form-reset">
            <label for="inputEmail1" class="form-label">Email address</label>
            <input type="email" class="form-control" id="inputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">Nosotros nunca compartiremos tu email con nadie</div>
        </div>
        <button type="submit" class="btn btn-primary">Reset Password</button>
    </form>
`;
const formulario=document.querySelector('#form-reset');
formulario.onsubmit=(e)=>{
    e.preventDefault();
    const form=e.target;
    crearToken(form);

    }

}

function crearToken(form){
const inputEmail=form.querySelector('#inputEmail1');
const divContenedor=document.querySelector('.form-reset');
const email=inputEmail.value;
    if(!email.trim()){
        imprimirAlerta('Debe introducir el email','error',divContenedor);
        return;
    }

    const datos={email};
    
    fetch(`${import.meta.env.VITE_URL_API}/veterinarios/reset-password`, {
    method: "POST",
    body: JSON.stringify(datos),
    headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json())
    .then(resultado => {
        if(resultado.msg){
            imprimirAlerta(resultado.msg,'error',divContenedor);
            return;
        }
        imprimirAlerta(resultado.mensaje,'exito',divContenedor);
        inputEmail.value='';
        
    })
    .catch(err => console.log(err));

}

})()
