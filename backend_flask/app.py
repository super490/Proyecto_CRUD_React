import os   
from flask import Flask, request, jsonify # Importa las clases y funciones necesarias de Flask
from flask_sqlalchemy import SQLAlchemy # Herramienta para interactuar con la base de datos
from dotenv import load_dotenv # Carga variables de entorno desde el archivo .env
from flask_cors import CORS  # Permite que el frontend (en otro dominio) se comunique con el backend
from flask_migrate import Migrate # Ayuda a gestionar las migraciones de la base de datos

load_dotenv() # Esta función busca el archivo .env y carga sus variables en el entorno del sistema
print("1. Variables de entorno cargadas.")
# --- Inicialización de la Aplicación y sus Extensiones ---

app = Flask(__name__) # Crea una instancia de la aplicación Flask
CORS(app) # Habilita CORS (Cross-Origin Resource Sharing) para todas las rutas. Esto es crucial para que el frontend pueda hacer peticiones al backend.
print("2. App de Flask inicializada.")

# Configuración de la base de datos PostgreSQL
# Obtiene la URI de la BD de las variables de entorno, que debería estar en el archivo .env
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') 
# Deshabilita el seguimiento de modificaciones para evitar advertencias de rendimiento
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

print("3. Configuración de BD establecida.")
db = SQLAlchemy(app) # Inicializa la extensión de SQLAlchemy con la aplicación Flask
print("4. SQLAlchemy inicializado.")
migrate = Migrate(app, db) # Inicializa la extensión Flask-Migrate para gestionar los cambios en la estructura de la base de datos
print("5. Flask-Migrate inicializado.")

# --- Definición del Modelo de Usuario ---

# Esta clase representa la tabla 'usuarios' en la base de datos
class Usuario(db.Model):
    __tablename__ = 'usuarios' # Define explícitamente el nombre de la tabla
    id = db.Column(db.Integer, primary_key=True) # Columna para el ID, que es la clave primaria
    correo_electronico = db.Column(db.String(120), unique=True, nullable=False) # Columna para el email, debe ser único y no nulo
    nombre = db.Column(db.String(100), nullable=False) # Columna para el nombre, no puede ser nulo
    edad = db.Column(db.Integer, nullable=False) # Columna para la edad, no puede ser nulo

    def __repr__(self):
        # Representación de cadena para un objeto de usuario, útil para la depuración
        return f'<Usuario {self.correo_electronico}>'

    # Método para serializar el objeto de usuario a un diccionario, ideal para convertir a JSON
    def to_dict(self):
        return {
            'id': self.id,
            'correoElectronico': self.correo_electronico, # Se usa camelCase para compatibilidad con el frontend
            'nombre': self.nombre,
            'edad': self.edad
        }

# --- Rutas (Endpoints de la API REST) ---

# Endpoint para obtener todos los usuarios
@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    try:
        usuarios = Usuario.query.all() # Consulta todos los registros de la tabla 'usuarios'
        # Convierte cada objeto de usuario a un diccionario y lo retorna como una lista JSON
        return jsonify([usuario.to_dict() for usuario in usuarios])
    except Exception as e:
         # Manejo de errores genérico
        return jsonify({'message': str(e)}), 500

# Endpoint para crear un nuevo usuario
@app.route('/api/usuarios', methods=['POST'])
def add_usuario():
    data = request.get_json() # Obtiene los datos del cuerpo de la petición en formato JSON
    if not data:
        # Si no hay datos, retorna un error 400 (Bad Request)
        return jsonify({'message': 'No data provided'}), 400
    
    # Extrae los datos del JSON. Se usan .get() para evitar errores si la clave no existe
    correo_electronico = data.get('correoElectronico')
    nombre = data.get('nombre')
    edad = data.get('edad')

    if not correo_electronico or not nombre or not edad:
        # Si faltan campos obligatorios, retorna un error 400
        return jsonify({'message': 'Faltan campos obligatorios'}), 400

    # Validaciones de datos (buena práctica)
    if not isinstance(edad, int) or edad <= 0:
        return jsonify({'message': 'La edad debe ser un número entero positivo'}), 400

    try:
        # Crea una nueva instancia del modelo Usuario
        nuevo_usuario = Usuario(correo_electronico=correo_electronico, nombre=nombre, edad=edad)
        db.session.add(nuevo_usuario) # Agrega el nuevo usuario a la sesión de la base de datos
        db.session.commit() # Confirma la transacción (guarda el usuario en la BD)
        # Retorna el nuevo usuario y un código de estado 201 (Created)
        return jsonify(nuevo_usuario.to_dict()), 201
    except Exception as e:
        db.session.rollback() # Si algo falla, revierte la transacción para no dejar datos inconsistentes
        return jsonify({'message': f'Error al agregar usuario: {str(e)}'}), 400

# Endpoint para obtener un usuario por su ID
@app.route('/api/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    try:
        usuario = Usuario.query.get(id) # Busca un usuario por su clave primaria (ID)
        if not usuario:
            return jsonify({'message': 'Usuario no encontrado'}), 404 # Retorna un error 404 si no se encuentra
        return jsonify(usuario.to_dict()) # Retorna el usuario encontrado
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
# Endpoint para actualizar un usuario por su ID
@app.route('/api/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    try:
        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({'message': 'Usuario no encontrado'}), 404

        # Actualiza los campos solo si se proporcionan en el cuerpo de la petición
        if 'correoElectronico' in data:
            usuario.correo_electronico = data['correoElectronico']
        if 'nombre' in data:
            usuario.nombre = data['nombre']
        if 'edad' in data:
            edad = data['edad']
            if not isinstance(edad, int) or edad <= 0:
                return jsonify({'message': 'La edad debe ser un número entero positivo'}), 400
            usuario.edad = edad

        db.session.commit() # Guarda los cambios en la base de datos
        return jsonify(usuario.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al actualizar usuario: {str(e)}'}), 400

# Endpoint para eliminar un usuario por su ID
@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    try:
        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({'message': 'Usuario no encontrado'}), 404

        db.session.delete(usuario) # Marca el objeto para ser eliminado
        db.session.commit() # Ejecuta la eliminación
        return jsonify({'message': 'Usuario eliminado correctamente'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
