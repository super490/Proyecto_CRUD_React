import React, {useState, useEffect} from "react";
// import axios from 'axios'; 
import SimpleForm from "./components/SimpleForm/SimpleForm";
import ListaUsuarios from "./components/ListaUsuarios/ListaUsuarios";

// Esta URL ya no se usará
// const API_BASE_URL = 'http://localhost:5000/api';

function App() {
 // Usamos un estado inicial de ejemplo, o vacío
  const [usuarios, setUsuarios] = useState([
    { id: 1, correoElectronico: 'ejemplo@correo.com', nombre: 'Ejemplo de Usuario', edad: 25 },
    { id: 2, correoElectronico: 'prueba@correo.com', nombre: 'Prueba de Usuario', edad: 30 }
  ]);
  const [activeTab, setActiveTab] = useState('registro');
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

// 1. Cargar Usuarios al Inicio (GET) - 
  useEffect(() => {

  }, []); 

 // 2. Agregar Usuario (POST) 
 const agregarUsuario = (nuevoUsuario) => {
 // Simulamos la creación de un nuevo ID 
 const nuevoId = Math.max(...usuarios.map(u => u.id), 0) + 1;
 const usuarioConId = { ...nuevoUsuario, id: nuevoId };
 setUsuarios((prevUsuarios) => [...prevUsuarios, usuarioConId]);
};

// 3. Eliminar Usuario (DELETE) 
 const eliminarUsuario = (idAEliminar) => {
   setUsuarios((prevUsuarios) => prevUsuarios.filter(usuario => usuario.id !== idAEliminar));
 };

// 4. Iniciar Edición de Usuario
  const iniciarEdicionUsuario = (idUsuario) => {
  const usuarioEncontrado = usuarios.find(usuario => usuario.id === idUsuario);
    if (usuarioEncontrado) {
       setUsuarioAEditar(usuarioEncontrado);
       setActiveTab('registro');
  }
};

// 5. Actualizar Usuario (PUT)
const actualizarUsuario = (usuarioActualizado) => {
  setUsuarios((prevUsuarios) =>
    prevUsuarios.map((usuario) =>
      usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario
        )
    );
    setUsuarioAEditar(null);
   setActiveTab('lista');
};

// 6. Manejador de Envío del Formulario 
 const handleFormSubmit = (formData) => {
   if (usuarioAEditar) {
    actualizarUsuario({ ...formData, id: usuarioAEditar.id });
  } else {
     agregarUsuario(formData);
   }
    setUsuarioAEditar(null);
};

  return (
    <div className="App">
   </div>
  );
}

export default App;