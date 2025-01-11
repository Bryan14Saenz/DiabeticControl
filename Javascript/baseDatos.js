// Llamar a indexedDB
const IDBRequest = indexedDB.open('Pacientes', 1);

// Eventos
IDBRequest.addEventListener('upgradeneeded', (e) => {
  const db = IDBRequest.result;

  db.createObjectStore('Pacientes', {
    autoIncrement: true,
  });
});

IDBRequest.addEventListener('success', (e) => {
  console.log('Base de datos abierta');
});

IDBRequest.addEventListener('error', (e) => {
  console.log('Error al abrir la base de datos');
});

// Funciones CRUD
const addPaciente = (paciente) => {
  const db = IDBRequest.result;
  const transaction = db.transaction('Pacientes', 'readwrite');
  const store = transaction.objectStore('Pacientes');

  store.add(paciente);

  transaction.addEventListener('complete', (e) => {
    alert('Paciente agregado');
  });
};

const modiPaciente = (paciente) => {
  const db = IDBRequest.result;
  const transaction = db.transaction('Pacientes', 'readwrite');
  const store = transaction.objectStore('Pacientes');

  store.put(paciente);

  transaction.addEventListener('complete', (e) => {
    alert('Paciente modificado');
  });
};

const delPaciente = (paciente) => {
  const db = IDBRequest.result;
  const transaction = db.transaction('Pacientes', 'readwrite');
  const store = transaction.objectStore('Pacientes');

  store.delete(paciente);

  transaction.addEventListener('complete', (e) => {
    alert('Paciente eliminado');
  });
};

const getAllPacientes = () => {
  const db = IDBRequest.result;
  const transaction = db.transaction('Pacientes', 'readonly');
  const store = transaction.objectStore('Pacientes');

  const cursor = store.openCursor();

  cursor.addEventListener('success', (e) => {
    console.log(e.target.result.value);
  });

  cursor.addEventListener('error', (e) => {
    alert('Error al obtener los pacientes');
  });
};

getAllUsers();

const user = {
  name: 'Luis',
  age: 25,
};

addUser(user);
modifyUser(user);
removeUser(user);
