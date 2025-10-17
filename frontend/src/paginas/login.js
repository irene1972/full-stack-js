import {imprimirAlerta} from '../funciones.js';

(()=>{
const botonLogin=document.querySelector('#login');
const contenedorBotones=document.querySelector('.botones');
const contenedorLogin=document.querySelector('#resul');

botonLogin.addEventListener('click',abrirFormulario);

function abrirFormulario(){
    contenedorBotones.remove();
    contenedorLogin.innerHTML=`
    <form id="form-login">
        <div class="mb-3">
            <label for="inputEmail2" class="form-label">Email address</label>
            <input type="email" class="form-control" id="inputEmail2" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">Nosotros nunca compartiremos tu email con nadie</div>
        </div>
        <div class="mb-3">
            <label for="inputPassword2" class="form-label">Password</label>
            <input type="password" class="form-control" id="inputPassword2">
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
    </form>
`;
const formulario=document.querySelector('#form-login');
formulario.onsubmit=(e)=>{
    e.preventDefault();
    const form=e.target;
    login(form);

    }
}

function login(form){
    //console.log(form);
    //const divContenedor=document.querySelector('#form-login');
    const inputEmail=form.querySelector('#inputEmail2');
    const inputPassword=form.querySelector('#inputPassword2');
    const email=inputEmail.value.trim();
    const password=inputPassword.value.trim();

    if(!email || !password){
        imprimirAlerta('Todos los campos son obligatorios','error',form);
        return;
    }

    const datos={email,password};
    
    fetch(`${import.meta.env.VITE_URL_API}/veterinarios/login`, {
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
        imprimirAlerta('Ha sido autenticado con éxito','exito',form);
        inputEmail.value='';
        inputPassword.value='';
        console.log(resultado);
        
    })
    .catch(err => console.log(err));

}
})()