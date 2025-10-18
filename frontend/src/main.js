import './style.css';

(()=>{
document.querySelector('#app').innerHTML = `
  <header>
    <div class="header">
      <h2 class="header"><a class="header" href="index.html">Administrador de Pacientes Clínica <span class="header">Veterinaria</span></a></h2>
    </div>
  </header>
  <div class="botones">
    <button id="login">Login</button>
    <button id="registrar">Registrarse</button>
    <button id="reset-password">Reset Password</button>
  </div>
  <div id="resul"></div>
`;
})()
