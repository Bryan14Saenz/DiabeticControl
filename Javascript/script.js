// constantes
const spanOpcionesNombre = document.getElementById('spanOpcionesNombre');
const spanOpcionesApellido = document.getElementById('spanOpcionesApellido');
const spanOpcionesTel = document.createElement('span');
const spanOpcionesEdad = document.createElement('span');
const spanOpcionesId = document.createElement('span');

const btnAgregar = document.getElementById('btnAgregar');
const btnVer = document.getElementById('btnVer');
const btnBuscar = document.getElementById('btnBuscar');
const btnSeleccion = document.getElementsByClassName('btnSeleccion');

const header = document.querySelector('#header');
const headerUsuario = document.querySelector('.usuario');
const headerNavBar = document.querySelector('.navbar');
const mainInicio = document.querySelector('.main-inicio');
const mainAgregar = document.querySelector('.main-agregar');
const mainVer = document.querySelector('.main-ver');
const mainOpciones = document.querySelector('.main-opciones');
const mainFuncionalidades = document.querySelector('.main-funcionalidades');
const footer = document.querySelector('#footer');

const modal = document.createElement('div');

const datoForm = document.getElementById('formAgregar');
const tableBody = document.getElementById('tbody');

const IDBRequest = indexedDB.open('Pacientes', 1);
let db;

// Petitions
IDBRequest.addEventListener('upgradeneeded', (e) => {
  const db = e.target.result;

  if (!db.objectStoreNames.contains('Pacientes')) {
    db.createObjectStore('Pacientes', { autoIncrement: true });
    console.log('Object store "Pacientes" creada.');
  }
});

IDBRequest.addEventListener('success', (e) => {
  db = e.target.result;
  console.log('Base de datos abierta');
});

IDBRequest.addEventListener('error', (e) => {
  console.error('Error al abrir la base de datos', e.target.error);
});

// Funciones
const inicioDeCarga = () => {
  const divCarga = document.createElement('div');
  divCarga.classList.add('cargando');
  divCarga.innerHTML = `
  <div class="loading"></div>
  <p>Entrando a Diabetic Control...</p>`;

  document.body.appendChild(divCarga);

  setTimeout(() => {
    divCarga.remove();
  }, 3000);
};

const addPaciente = (paciente) => {
  if (!db) {
    console.error('No se ha abierto la base de datos');
    return;
  }

  const transaction = db.transaction('Pacientes', 'readwrite');
  const store = transaction.objectStore('Pacientes');

  const request = store.add(paciente);

  request.addEventListener('success', (e) => {
    alert('Paciente agregado');
  });

  request.addEventListener('error', (e) => {
    console.error('Error al agregar el paciente', e.target.error);
  });
};

const obtenerLlamada = () => {
  if (!db) {
    console.error('No se ha abierto la base de datos');
    return;
  }

  const transaction = db.transaction('Pacientes', 'readonly');
  const store = transaction.objectStore('Pacientes');

  const request = store.getAll();

  return request;
};

const cargarPacientes = () => {
  obtenerLlamada().addEventListener('success', (e) => {
    const pacientes = e.target.result;

    tableBody.innerHTML = '';

    if (pacientes.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6">No hay pacientes</td></tr>';
    } else {
      pacientes.forEach((paciente) => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td scope="row">${paciente.id}</td>
          <td>${paciente.nombre}</td>
          <td>${paciente.apellido}</td>
          <td>${paciente.tel}</td>
          <td>${paciente.edad}</td>
          <td>
            <button 
            type="button" 
            class="btn btnSeleccion"
            data-id="${paciente.id}"
            data-nombre="${paciente.nombre}"
            data-apellido="${paciente.apellido}"
            data-tel="${paciente.tel}"
            data-edad="${paciente.edad}"
            onclick="seleccionarPaciente(
              this.dataset.nombre,
              this.dataset.apellido,
              this.dataset.tel,
              this.dataset.edad,
              this.dataset.id
            )"
            >
              Seleccionar
            </button>
          </td>
        `;

        tableBody.appendChild(row);
      });
    }
  });
};

function buscarPaciente(nombre) {
  obtenerLlamada().addEventListener('success', (e) => {
    const pacientes = e.target.result;

    pacientes.sort((a, b) => a.nombre.localeCompare(b.nombre));

    tableBody.innerHTML = '';

    if (pacientes.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6">No hay pacientes</td></tr>';
    } else {
      pacientes.forEach((paciente) => {
        if (paciente.nombre.toLowerCase().includes(nombre.toLowerCase())) {
          const row = document.createElement('tr');
          row.innerHTML = `
          <td scope="row">${paciente.id}</td>
          <td>${paciente.nombre}</td>
          <td>${paciente.apellido}</td>
          <td>${paciente.tel}</td>
          <td>${paciente.edad}</td>
          <td>
            <button 
            type="button" 
            class="btn btnSeleccion"
            data-id="${paciente.id}"
            data-nombre="${paciente.nombre}"
            data-apellido="${paciente.apellido}"
            data-tel="${paciente.tel}"
            data-edad="${paciente.edad}"
            onclick="seleccionarPaciente(
              this.dataset.nombre,
              this.dataset.apellido,
              this.dataset.tel,
              this.dataset.edad,
              this.dataset.id
            )"
            >
              Seleccionar
            </button>
          </td>
          `;

          tableBody.appendChild(row);
        }
      });
    }
  });
}

function seleccionarPaciente(nombre, apellido, tel, edad, id) {
  mainInicio.style.display = 'none';
  mainVer.style.display = 'none';
  headerNavBar.style.display = 'none';
  headerUsuario.style.display = 'flex';
  mainOpciones.style.display = 'grid';

  spanOpcionesNombre.textContent = nombre;
  spanOpcionesApellido.textContent = apellido;
  spanOpcionesTel.textContent = tel;
  spanOpcionesEdad.textContent = edad;
  spanOpcionesId.textContent = id;
}

function verOpciones() {
  modal.classList.add('modal-content');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <p>Nombre: ${spanOpcionesNombre.textContent}</p>
      <p>Apellido: ${spanOpcionesApellido.textContent}</p>
      <p>Teléfono: ${spanOpcionesTel.textContent}</p>
      <p>Fecha de Nacimiento: ${spanOpcionesEdad.textContent}</p>
      <p>ID: ${spanOpcionesId.textContent}</p>
      <button type="button" class="btn cerrarSesión" onclick="cerrarSesión()">Cerrar Sesión</button>
    </div>
  `;

  modal.querySelector('.close').addEventListener('click', () => {
    modal.remove();
  });

  document.body.appendChild(modal);
}

function cerrarSesión() {
  spanOpcionesNombre.textContent = '';
  spanOpcionesApellido.textContent = '';

  modal.remove();

  headerUsuario.style.display = 'none';
  mainOpciones.style.display = 'none';
  headerNavBar.style.display = 'flex';
  mainInicio.style.display = 'flex';
  footer.style.display = 'flex';
}

// Eventos
window.addEventListener('load', () => {
  cargarPacientes();
  inicioDeCarga();
});

btnAgregar.addEventListener('click', () => {
  if (mainAgregar.style.display === 'none') {
    mainAgregar.style.display = 'flex';
    mainVer.style.display = 'none';
    footer.style.display = 'none';
  } else {
    mainAgregar.style.display = 'none';
    footer.style.display = 'flex';
  }
});

btnVer.addEventListener('click', () => {
  if (mainVer.style.display === 'none') {
    mainVer.style.display = 'flex';
    mainAgregar.style.display = 'none';
    footer.style.display = 'none';
  } else {
    mainVer.style.display = 'none';
    footer.style.display = 'flex';
  }
});

datoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const paciente = {
    nombre: e.target[0].value,
    apellido: e.target[1].value,
    edad: e.target[2].value,
    tel: e.target[3].value,
    id: e.target[4].value,
  };

  addPaciente(paciente);

  e.target.reset();

  setTimeout(() => {
    cargarPacientes();
  }, 500);
});

btnBuscar.addEventListener('click', (e) => {
  e.preventDefault();

  const nombre = inputBuscar.value;
  buscarPaciente(nombre);
});

