// constantes
const btnAgregar = document.getElementById('btnAgregar');
const btnVer = document.getElementById('btnVer');

const mainAgregar = document.querySelector('.main-agregar');
const mainVer = document.querySelector('.main-ver');

// Eventos
btnAgregar.addEventListener('click', () => {
  if (mainAgregar.style.display === 'none') {
    mainAgregar.style.display = 'flex';
    mainVer.style.display = 'none';
  } else {
    mainAgregar.style.display = 'none';
  }
});

btnVer.addEventListener('click', () => {
  if (mainVer.style.display === 'none') {
    mainVer.style.display = 'flex';
    mainAgregar.style.display = 'none';
  } else {
    mainVer.style.display = 'none';
  }
});
