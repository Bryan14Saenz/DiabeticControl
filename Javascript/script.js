// constantes
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

const IDBRequest = indexedDB.open('Clientes', 1);
let db;

// Petitions
IDBRequest.addEventListener('upgradeneeded', (e) => {
  const db = e.target.result;

  if (!db.objectStoreNames.contains('clientes')) {
    db.createObjectStore('clientes', { autoIncrement: true });
    console.log('Object store "Clientes" creada.');
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
  <p>Abriendo la base de datos...</p>`;

  document.body.appendChild(divCarga);

  setTimeout(() => {
    divCarga.remove();
  }, 3000);
};

const addCliente = (clientes) => {
  if (!db) {
    console.error('No se ha abierto la base de datos');
    return;
  }

  const transaction = db.transaction('clientes', 'readwrite');
  const store = transaction.objectStore('clientes');

  const request = store.add(clientes);

  request.addEventListener('success', (e) => {
    alert('cliente agregado');
  });

  request.addEventListener('error', (e) => {
    console.error('Error al agregar el cliente', e.target.error);
  });
};

const obtenerLlamada = () => {
  if (!db) {
    console.error('No se ha abierto la base de datos');
    return;
  }

  const transaction = db.transaction('clientes', 'readonly');
  const store = transaction.objectStore('clientes');

  const request = store.getAll();

  return request;
};

const cargarClientes = () => {
  obtenerLlamada().addEventListener('success', (e) => {
    const clientes = e.target.result;

    tableBody.innerHTML = '';

    if (clientes.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="6">No hay clientes disponibles</td></tr>';
    } else {
      clientes.forEach((clientes) => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td scope="row">${clientes.id}</td>
          <td>${clientes.nombre}</td>
          <td>${clientes.apellido}</td>
          <td>${clientes.tel}</td>
          <td>${clientes.dirección}</td>
          <td>
            <button 
            type="button" 
            class="btn btnSeleccion"
            data-id="${clientes.id}"
            data-nombre="${clientes.nombre}"
            data-apellido="${clientes.apellido}"
            data-tel="${clientes.tel}"
            data-edad="${clientes.dirección}"
            onclick="seleccionarCliente(
              this.dataset.nombre,
              this.dataset.apellido,
              this.dataset.tel,
              this.dataset.dirección,
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

function buscarCliente(nombre) {
  obtenerLlamada().addEventListener('success', (e) => {
    const clientes = e.target.result;

    clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));

    tableBody.innerHTML = '';

    if (clientes.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="6">No hay clientes disponibles</td></tr>';
    } else {
      clientes.forEach((clientes) => {
        if (clientes.nombre.toLowerCase().includes(clientes.toLowerCase())) {
          const row = document.createElement('tr');
          row.innerHTML = `
          <td scope="row">${clientes.id}</td>
          <td>${clientes.nombre}</td>
          <td>${clientes.apellido}</td>
          <td>${clientes.tel}</td>
          <td>${clientes.dirección}</td>
          <td>
            <button 
            type="button" 
            class="btn btnSeleccion"
            data-id="${clientes.id}"
            data-nombre="${clientes.nombre}"
            data-apellido="${clientes.apellido}"
            data-tel="${clientes.tel}"
            data-dirección="${clientes.dirección}"
            onclick="seleccionarCliente(
              this.dataset.nombre,
              this.dataset.apellido,
              this.dataset.tel,
              this.dataset.dirección,
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

function seleccionarCliente(nombre, apellido, tel, dirección, id) {
  alert('Funcionalidad no disponible');
}

// Eventos
window.addEventListener('load', () => {
  cargarClientes();
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

  const cliente = {
    nombre: e.target[0].value,
    apellido: e.target[1].value,
    dirección: e.target[2].value,
    tel: e.target[3].value,
    id: e.target[4].value,
  };

  addCliente(cliente);

  e.target.reset();

  setTimeout(() => {
    cargarClientes();
  }, 500);
});

btnBuscar.addEventListener('click', (e) => {
  e.preventDefault();

  const nombre = inputBuscar.value;
  buscarCliente(nombre);
});
