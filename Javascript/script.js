// constantes
const btnAgregar = document.getElementById('btnAgregar');
const btnVer = document.getElementById('btnVer');
const btnActualizar = document.getElementById('btnActualizar');
const btnBuscar = document.getElementById('btnBuscar');
const btnSeleccion = document.getElementsByClassName('btnSeleccion');

const mainAgregar = document.querySelector('.main-agregar');
const mainVer = document.querySelector('.main-ver');
const footer = document.querySelector('#footer');

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

const cargarPacientes = () => {
  if (!db) {
    console.error('No se ha abierto la base de datos');
    return;
  }

  const transaction = db.transaction('Pacientes', 'readonly');
  const store = transaction.objectStore('Pacientes');

  const request = store.getAll();

  request.addEventListener('success', (e) => {
    const pacientes = e.target.result;
    tableBody.innerHTML = '';

    if (pacientes.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6">No hay pacientes</td></tr>';
    } else {
      pacientes.forEach((paciente) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <th scope="row">${paciente.id}</th>
          <td>${paciente.name}</td>
          <td>${paciente.lastName}</td>
          <td>${paciente.tel}</td>
          <td>${paciente.age}</td>
          <td>
            <button type="button" class="btn btn-outline-primary">Seleccionar</button>
          </td>
        `;

        tableBody.appendChild(row);
      });
    }
  });
};

function buscarPaciente(nombre) {
  if (!db) {
    console.error('No se ha abierto la base de datos');
    return;
  }

  const transaction = db.transaction('Pacientes', 'readonly');
  const store = transaction.objectStore('Pacientes');

  const request = store.getAll();

  request.addEventListener('success', (e) => {
    e.target.result.sort((a, b) => a.name.localeCompare(b.name));

    const pacientes = e.target.result;
    tableBody.innerHTML = '';

    if (pacientes.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6">No hay pacientes</td></tr>';
    } else {
      pacientes.forEach((paciente) => {
        if (paciente.name.toLowerCase().includes(nombre.toLowerCase())) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <th scope="row">${paciente.id}</th> 
            <td>${paciente.name}</td>
            <td>${paciente.lastName}</td>
            <td>${paciente.tel}</td>
            <td>${paciente.age}</td>
            <td>
              <button type="button" class="btn btn-outline-primary">Seleccionar</button>
            </td>
          `;

          tableBody.appendChild(row);
        }
      });
    }
  });
}

// Eventos
window.addEventListener('load', () => {
  cargarPacientes();
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

btnActualizar.addEventListener('click', () => {
  cargarPacientes();
});

datoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const paciente = {
    name: e.target[0].value,
    lastName: e.target[1].value,
    age: e.target[2].value,
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