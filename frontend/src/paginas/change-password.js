import {imprimirAlerta} from '../funciones.js';

(()=>{

    const divResul=document.querySelector('#resul');
    const formulario=document.querySelector('#form-reset');
    const inputPassword4=document.querySelector('#inputPassword4');
    const inputPassword44=document.querySelector('#inputPassword44');

    const url = window.location.href;
    const paramsString = url.split("?")[1];
    const paramsArray = paramsString.split("&");
    const params = {};
    paramsArray.forEach(param => {
    const [key, value] = param.split("=");
    params[key] = value;
    });
    const token = params.token;
    console.log(token); 



    formulario.addEventListener('submit',validarFormulario);
    
    function validarFormulario(e){
        e.preventDefault();
        const input4=inputPassword4.value.trim();
        const input44=inputPassword44.value.trim();
        
        if(input4 !== input44){
            imprimirAlerta('Los dos passwords deben ser iguales','error',divResul);
            return;
        }
        if(!input4 || !input44){
            imprimirAlerta('Deben cumplimentarse los dos campos','error',divResul);
            return;
        }
        cambiarPassword(token,input4);
    }

    function cambiarPassword(token,password){
        //llamada a la api: {{API_URL}}/veterinarios/reset-password/1j7op3bbkdo44riqn15o
        //con un post que contiene el password recuperado del input password
        
        const datos={password};
    
        fetch(`${import.meta.env.VITE_URL_API}/veterinarios/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(resultado => {
            if(resultado.msg){
                imprimirAlerta(resultado.msg,'error',formulario);
                return;
            }
            imprimirAlerta(resultado.mensaje,'exito',formulario);
            inputPassword4.value='';
            inputPassword44.value='';
            
        })
        .catch(err => console.log(err));

    }
})()