import {imprimirAlerta} from '../funciones.js';

(()=>{

    const divResul=document.querySelector('#resul');

    const url = window.location.href;
    const paramsString = url.split("?")[1];
    const paramsArray = paramsString.split("&");
    const params = {};
    paramsArray.forEach(param => {
    const [key, value] = param.split("=");
    params[key] = value;
    });
    const token = params.token;
    //console.log(token); 

    fetch(`${import.meta.env.VITE_URL_API}/veterinarios/confirmar/${token}`)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            if(data.msg){
                imprimirAlerta(data.msg,'error',divResul);
                return;
            }
            imprimirAlerta(data.mensaje,'exito',divResul);
            const enlace=document.createElement('P');
            enlace.innerHTML=`<p><a class="link-opacity-75" href="${import.meta.env.VITE_URL_FRONTEND}/index.html">Iniciar Sesion</a></p>`;
            divResul.appendChild(enlace);
        })
        .catch(error => {
            console.error('Error:', error);
        });


})()