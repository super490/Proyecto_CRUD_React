import { useState, useEffect } from 'react';
// Importa los Hooks de React necesarios: useState para el estado local y useEffect para efectos secundarios.

function SimpleForm({ onFormSubmit, usuarioInicial }) {
  // Define el componente funcional SimpleForm.
  // Recibe dos propiedades (props):
  // - onFormSubmit: Una función que se llama cuando el formulario se envía.
  // - usuarioInicial: Un objeto de usuario si se está editando uno, o null si es un nuevo registro.

  // --- Estados Locales del Formulario ---
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  // Estos son los estados para controlar los valores de los campos del formulario.
  // Se inicializan como cadenas vacías.

  // --- Efecto Secundario (useEffect) ---
  useEffect(() => {
    // Este efecto se ejecuta cada vez que 'usuarioInicial' cambia.
    if (usuarioInicial) {
      // Si se recibe un 'usuarioInicial' (estamos en modo edición):
      setCorreoElectronico(usuarioInicial.correoElectronico);
      // Precarga el campo de correo electrónico con los datos del usuario.
      setNombre(usuarioInicial.nombre);
      // Precarga el campo de nombre con los datos del usuario.
      setEdad(usuarioInicial.edad.toString());
      // Precarga el campo de edad, convirtiendo el número a cadena de texto.
    }
    // NOTA: No se limpia el formulario aquí si 'usuarioInicial' es null.
    // La lógica de limpieza para un nuevo registro se maneja en 'handleSubmit'.
  }, [usuarioInicial]);
  // La dependencia '[usuarioInicial]' asegura que el efecto se re-ejecute solo cuando 'usuarioInicial' cambia.

  // --- Manejadores de Eventos ---
  const handleChange = (e) => {
    // Función que se llama cada vez que un campo del formulario cambia su valor.
    const { name, value } = e.target;
    // Desestructura el 'name' (nombre del campo) y 'value' (valor actual) del elemento que disparó el evento.
    if (name === 'correoElectronico') {
      setCorreoElectronico(value);
    } else if (name === 'nombre') {
      setNombre(value);
    } else if (name === 'edad') {
      setEdad(value);
    }
    // Actualiza el estado local correspondiente al campo que cambió.
  };

  const handleSubmit = (e) => {
    // Función que se llama cuando el formulario se envía.
    e.preventDefault();
    // Previene el comportamiento por defecto del formulario (recargar la página).

    const formData = {
      // Crea un objeto con los datos actuales del formulario.
      correoElectronico,
      nombre,
      edad: parseInt(edad, 10), // Convierte la edad a un número entero.
    };

    if (onFormSubmit) {
      // Si la prop 'onFormSubmit' fue proporcionada:
      onFormSubmit(formData);
      // Llama a la función 'onFormSubmit' (generalmente en el componente padre, App.jsx)
      // pasándole los datos del formulario.
    }

    // --- Lógica de Limpieza del Formulario ---
    if (!usuarioInicial) {
      // Si NO estamos en modo edición (es decir, es un nuevo registro):
      setCorreoElectronico('');
      setNombre('');
      setEdad('');
      // Limpia todos los campos del formulario después de enviarlos.
    }
  };

  // --- Renderizado de la Interfaz de Usuario (JSX) ---
  return (
    <div className="box"> {/* Contenedor principal con estilo de caja Bulma */}
      <h2 className="title is-4 has-text-centered">
        {usuarioInicial ? 'Editar Usuario' : 'Registro de Usuario'}
        {/* Muestra "Editar Usuario" si hay un usuarioInicial, de lo contrario "Registro de Usuario". */}
      </h2>
      <form onSubmit={handleSubmit}> {/* El formulario HTML que maneja el envío */}
        {/* Campo para Correo Electrónico */}
        <div className="field">
          <label className="label" htmlFor="correoElectronico">Correo Electrónico:</label>
          <div className="control">
            <input
              className="input"
              type="email"
              id="correoElectronico"
              name="correoElectronico"
              value={correoElectronico}
              onChange={handleChange}
              required // Hace el campo obligatorio
              placeholder="Ej. usuario@ejemplo.com"
            />
          </div>
        </div>

        {/* Campo para Nombre */}
        <div className="field">
          <label className="label" htmlFor="nombre">Nombre:</label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              required // Hace el campo obligatorio
              placeholder="Ej. Juan Pérez"
            />
          </div>
        </div>

        {/* Campo para Edad */}
        <div className="field">
          <label className="label" htmlFor="edad">Edad:</label>
          <div className="control">
            <input
              className="input"
              type="number"
              id="edad"
              name="edad"
              value={edad}
              onChange={handleChange}
              required // Hace el campo obligatorio
              min="0" // Establece un valor mínimo para la edad
              placeholder="Ej. 30"
            />
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="field is-grouped is-grouped-centered">
          <div className="control">
            <button type="submit" className="button is-primary is-medium">
              {usuarioInicial ? 'Actualizar Datos' : 'Enviar Datos'}
              {/* El texto del botón cambia según si es modo edición o registro. */}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SimpleForm; // Exporta el componente para ser usado en otros archivos.