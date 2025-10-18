function limpiarHTML(){
    const divApp=document.querySelector('#app');
    while(divApp.firstChild){
        divApp.removeChild(divApp.firstChild);
    }
}

export function imprimirAlerta(mensaje,tipo,divContenedor){
    //const divContenedor=document.querySelector('.form-reset');
    const divPrevio=document.querySelector(`.${tipo}`);
    if(divPrevio){
        divPrevio.remove();
    }
    const divAlerta=document.createElement('DIV');
    divAlerta.classList.add(`${tipo}`);
    divAlerta.textContent=mensaje;
    divContenedor.appendChild(divAlerta);
    setTimeout(()=>{
        divAlerta.remove();
    },3000);

}

export function autenticarUsuario(){
    const token=localStorage.getItem('token');
    if(!token) return;
    return token;
}