import React, { useState, useMemo } from 'react';
// Importa los Hooks de React necesarios:
// - useState: Para manejar el estado local (como el término de búsqueda).
// - useMemo: Para memorizar cálculos costosos (como el filtrado de usuarios) y optimizar el rendimiento.

// --- Función de Utilidad ---
const truncateText = (text, maxLength) => {
  // Función auxiliar para acortar una cadena de texto si excede un largo máximo.
  if (text.length > maxLength) { // Comprueba si la longitud del texto es mayor que el límite.
    return text.substring(0, maxLength) + '...'; // Trunca el texto y añade puntos suspensivos.
  }
  return text; // Devuelve el texto original si no necesita truncarse.
};

function ListaUsuarios({ usuarios, onUsuarioEliminar, onUsuarioEditar }) {
  // Define el componente funcional ListaUsuarios.
  // Recibe tres propiedades (props):
  // - usuarios: Un arreglo con la lista completa de usuarios a mostrar.
  // - onUsuarioEliminar: Una función que se llama para eliminar un usuario.
  // - onUsuarioEditar: Una función que se llama para iniciar la edición de un usuario.

  // --- Estado Local ---
  const [searchTerm, setSearchTerm] = useState('');
  // 'searchTerm': Almacena el texto que el usuario escribe en el campo de búsqueda.
  // 'setSearchTerm': La función para actualizar el término de búsqueda. Se inicializa vacío.

  // --- Manejador de Eventos ---
  const handleSearchChange = (e) => {
    // Función que se llama cada vez que el valor del campo de búsqueda cambia.
    setSearchTerm(e.target.value);
    // Actualiza el estado 'searchTerm' con el valor actual del campo de entrada.
  };

  // --- Memoización (Optimización) ---
  const filteredUsuarios = useMemo(() => {
    // 'filteredUsuarios': Almacena la lista de usuarios después de aplicar el filtro de búsqueda.
    // useMemo memoriza este cálculo y solo lo recalcula si 'usuarios' o 'searchTerm' cambian.
    if (!searchTerm) {
      // Si el término de búsqueda está vacío, devuelve todos los usuarios.
      return usuarios;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    // Convierte el término de búsqueda a minúsculas para una comparación sin distinción de mayúsculas/minúsculas.

    return usuarios.filter((usuario) =>
      // Filtra la lista de usuarios.
      usuario.correoElectronico.toLowerCase().includes(lowerCaseSearchTerm) ||
      // Incluye al usuario si su correo electrónico (en minúsculas) contiene el término de búsqueda.
      usuario.nombre.toLowerCase().includes(lowerCaseSearchTerm)
      // O si su nombre (en minúsculas) contiene el término de búsqueda.
    );
  }, [usuarios, searchTerm]);
  // Dependencias: el cálculo se re-ejecuta solo cuando 'usuarios' o 'searchTerm' cambian.

  // --- Manejadores de Eventos de Botones ---
  const handleClickEliminar = (id) => {
    // Función que se llama cuando se hace clic en el botón "Eliminar".
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      // Muestra un cuadro de diálogo de confirmación antes de eliminar.
      if (onUsuarioEliminar) {
        // Si la prop 'onUsuarioEliminar' fue proporcionada:
        onUsuarioEliminar(id);
        // Llama a la función 'onUsuarioEliminar' del componente padre (App.jsx) con el ID del usuario.
      }
    }
  };

  const handleClickEditar = (id) => {
    // Función que se llama cuando se hace clic en el botón "Editar".
    if (onUsuarioEditar) {
      // Si la prop 'onUsuarioEditar' fue proporcionada:
      onUsuarioEditar(id);
      // Llama a la función 'onUsuarioEditar' del componente padre (App.jsx) con el ID del usuario.
    }
  };

  // --- Renderizado de la Interfaz de Usuario (JSX) ---
  return (
    <div className="section"> {/* Contenedor principal con estilo de sección Bulma */}
      <div className="container"> {/* Contenedor Bulma para centrar el contenido */}
        <h2 className="title is-4 has-text-centered">Listado de Usuarios</h2> {/* Título de la sección */}

        {/* Muestra el número total de usuarios registrados */}
        <p className="has-text-centered mb-4">
          Total de usuarios registrados: <span className="tag is-primary is-medium">{usuarios.length}</span>
          {/* Muestra la cantidad de usuarios en el arreglo 'usuarios'. */}
        </p>

        {/* Sección de búsqueda */}
        <div className="columns is-centered">
          <div className="column is-one-third">
            <div className="field">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Buscar por correo o nombre..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-search"></i> {/* Icono de búsqueda de Font Awesome */}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Renderizado condicional de la tabla o mensaje */}
        {filteredUsuarios.length > 0 ? (
          // Si hay usuarios filtrados, muestra la tabla.
          <div className="box"> {/* Contenedor con estilo de caja Bulma */}
            <div className="table-container">
              <table className="table is-striped is-hoverable is-fullwidth"> {/* Tabla Bulma con estilos */}
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Correo Electrónico</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th className="has-text-centered" style={{ width: '150px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usuario) => (
                    // Mapea cada usuario filtrado a una fila de la tabla.
                    <tr key={usuario.id}> {/* 'key' es importante para la eficiencia de React */}
                      <td>{usuario.id}</td> {/* Muestra el ID del usuario */}
                      <td>{usuario.correoElectronico}</td> {/* Muestra el correo */}
                      <td>{truncateText(usuario.nombre, 10)}</td> {/* Muestra el nombre truncado. */}
                      <td>{usuario.edad}</td> {/* Muestra la edad */}
                      <td className="has-text-centered">
                        <div className="buttons is-centered are-small">
                          {/* Botón Editar */}
                          <button
                            className="button is-info"
                            onClick={() => handleClickEditar(usuario.id)}
                            style={{ width: '80px' }} // Ancho fijo para el botón.
                          >
                            <span className="icon">
                              <i className="fas fa-edit"></i> {/* Icono de edición */}
                            </span>
                            <span>Editar</span>
                          </button>
                          {/* Botón Eliminar */}
                          <button
                            className="button is-danger"
                            onClick={() => handleClickEliminar(usuario.id)}
                            style={{ width: '80px' }} // Ancho fijo para el botón.
                          >
                            <span className="icon">
                              <i className="fas fa-trash"></i> {/* Icono de eliminación */}
                            </span>
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Si no hay usuarios filtrados, muestra un mensaje.
          <p className="has-text-centered notification is-info">
            {searchTerm ? `No se encontraron usuarios para "${searchTerm}".` : 'No hay usuarios para mostrar. ¡Agrega algunos!'}
            {/* Mensaje dinámico según si hay un término de búsqueda o no. */}
          </p>
        )}
      </div>
    </div>
  );
}

export default ListaUsuarios; // Exporta el componente para ser usado en otros archivos.