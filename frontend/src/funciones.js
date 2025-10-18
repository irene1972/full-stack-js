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

export const formatearFecha=(fecha)=>{
    const nuevaFecha=new Date(fecha);
    return new Intl.DateTimeFormat('es',{dateStyle:'long'}).format(nuevaFecha);
}

export function cerrarSesion(){
    localStorage.removeItem('token');
    window.location.replace(`${import.meta.env.VITE_URL_FRONTEND}/index.html`);
}