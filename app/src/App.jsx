import React, {useState, useEffect} from "react";
import axios from 'axios';
import SimpleForm from "./components/SimpleForm/SimpleForm";
import ListaUsuarios from "./components/ListaUsuarios/ListaUsuarios";

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [activeTab, setActiveTab] = useState('registro');
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  // 1. Cargar Usuarios al Inicio (GET)
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/usuarios`);
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    fetchUsuarios();
  }, []); // El array de dependencias vacío [] asegura que se ejecuta solo una vez al montar el componente

  // 2. Agregar Usuario (POST)
  const agregarUsuario = async (nuevoUsuario) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios`, nuevoUsuario);
      setUsuarios((prevUsuarios) => [...prevUsuarios, response.data]); // Añade el usuario devuelto por el backend
    } catch (error) {
      console.error('Error al agregar usuario:', error.response ? error.response.data : error.message);
      alert(`Error al agregar usuario: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  // 3. Eliminar Usuario (DELETE)
  const eliminarUsuario = async (idAEliminar) => {
     {
      try {
        await axios.delete(`${API_BASE_URL}/usuarios/${idAEliminar}`);
        setUsuarios((prevUsuarios) => prevUsuarios.filter(usuario => usuario.id !== idAEliminar)); // Filtrar por 'id'
      } catch (error) {
        console.error('Error al eliminar usuario:', error.response ? error.response.data : error.message);
        alert(`Error al eliminar usuario: ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  // 4. Iniciar Edición de Usuario
  // Esta función ahora simplemente busca el usuario en el estado local, no necesita hacer otra petición GET
  const iniciarEdicionUsuario = (idUsuario) => {
    const usuarioEncontrado = usuarios.find(usuario => usuario.id === idUsuario); // Buscar por 'id'
    if (usuarioEncontrado) {
      setUsuarioAEditar(usuarioEncontrado);
      setActiveTab('registro'); // Cambia a la pestaña de registro para editar
    }
  };

  // 5. Actualizar Usuario (PUT)
  const actualizarUsuario = async (usuarioActualizado) => {
    try {
      // El backend Flask espera el ID en la URL y los datos en el cuerpo
      const response = await axios.put(`${API_BASE_URL}/usuarios/${usuarioActualizado.id}`, usuarioActualizado);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === usuarioActualizado.id ? response.data : usuario // Actualizar por 'id'
        )
      );
      setUsuarioAEditar(null); // Limpiar el usuario en edición
      setActiveTab('lista'); // Volver a la lista después de actualizar
    } catch (error) {
      console.error('Error al actualizar usuario:', error.response ? error.response.data : error.message);
      alert(`Error al actualizar usuario: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  // 6. Manejador de Envío del Formulario (llamado por SimpleForm)
  const handleFormSubmit = (formData) => {
    if (usuarioAEditar) {
      // Si estamos editando, pasamos el 'id' existente junto con los datos del formulario
      actualizarUsuario({ ...formData, id: usuarioAEditar.id });
    } else {
      // Si es un nuevo registro, simplemente pasamos los datos
      agregarUsuario(formData);
      // Limpieza del formulario para nuevo registro se maneja en SimpleForm.jsx
    }
    // Desactivar usuarioAEditar después de enviar para que el formulario se "limpie"
    // cuando cambias de modo edición a modo registro manual
    setUsuarioAEditar(null);
  };

  return (
    <div className="App">
      <div className="section">
        <div className="container">
          <div className="tabs is-boxed is-centered">
            <ul>
              <li className={activeTab === 'registro' ? 'is-active' : ''}>
                <a onClick={() => {
                  setActiveTab('registro');
                  setUsuarioAEditar(null); // Limpiar usuarioAEditar al cambiar a registro
                }}>
                  <span className="icon is-small"><i className="fas fa-user-plus" aria-hidden="true"></i></span>
                  <span>Registro de Usuario</span>
                </a>
              </li>
              <li className={activeTab === 'lista' ? 'is-active' : ''}>
                <a onClick={() => {
                  setActiveTab('lista');
                  setUsuarioAEditar(null); // Limpiar usuarioAEditar al cambiar a lista
                }}>
                  <span className="icon is-small"><i className="fas fa-users" aria-hidden="true"></i></span>
                  <span>Listado de Usuarios</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="columns is-centered">
            <div className={`column ${activeTab === 'registro' ? 'is-half' : 'is-full'}`}>
              {activeTab === 'registro' && (
                <SimpleForm
                  onFormSubmit={handleFormSubmit}
                  usuarioInicial={usuarioAEditar}
                />
              )}
              {activeTab === 'lista' && (
                <ListaUsuarios
                  usuarios={usuarios}
                  onUsuarioEliminar={eliminarUsuario}
                  onUsuarioEditar={iniciarEdicionUsuario}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;