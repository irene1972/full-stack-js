import './style.css';

(()=>{
document.querySelector('#app').innerHTML = `
<!--<div class="container-main">-->
  <header>
    <h1><a href="index.html">Administrador de Pacientes Clínica Veterinaria</a></h1>
    <img src="vite.svg" alt="APV logo" />
  </header>
  <div class="botones">
    <button id="login">Login</button>
    <button id="registrar">Registrarse</button>
    <button id="reset-password">Reset Password</button>
  </div>
  <div id="resul"></div>
<!--</div>-->
`;
})()
