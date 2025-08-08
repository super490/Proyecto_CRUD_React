
# Descripción del Proyecto 🚀

Este es un proyecto **Full-Stack** que implementa una aplicación de **CRUD (Crear, Leer, Actualizar, Eliminar)** de usuarios. El proyecto está dividido en dos componentes principales: un **frontend** desarrollado con React y un **backend** creado con el framework Flask de Python.

El objetivo principal es demostrar la comunicación entre una aplicación de frontend y una API de backend para realizar operaciones persistentes en una base de datos.

-----

## Estructura del Repositorio 📁

El repositorio está organizado en dos carpetas principales, lo que facilita la separación y el desarrollo de cada parte de la aplicación.

  * **`PROYECTO_CRUD_...` (Frontend):**
    Esta carpeta contiene la aplicación web desarrollada con **React**. Se encarga de la interfaz de usuario, donde el usuario puede registrar, visualizar, editar y eliminar usuarios. Utiliza la librería `axios` para comunicarse con el backend.

  * **`backend_flask` (Backend):**
    Esta carpeta contiene la API RESTful construida con **Flask**. Es responsable de la lógica del servidor, incluyendo el manejo de las peticiones HTTP (`GET`, `POST`, `PUT`, `DELETE`), la interacción con la base de datos y la gestión de la lógica de negocio. También incluye archivos de **Docker** para su fácil despliegue y portabilidad.

-----

## Tecnologías Utilizadas 🛠️

### Frontend

  - **React**
  - **Vite**
  - **Axios**

### Backend

  - **Python 3**
  - **Flask**
  - **Flask-SQLAlchemy**
  - **PostgreSQL**
  - **Flask-CORS** (para permitir la comunicación entre el frontend y el backend)
  - **Flask-Migrate** (para gestionar los cambios en la base de datos)
  - **Docker / Docker Compose** (para orquestación de contenedores)

-----

## Cómo Iniciar el Proyecto en Local 🚀

Existen dos formas de iniciar el proyecto:

### Opción 1: Sin Docker (entorno de desarrollo local)

1.  **Configuración del Backend:**

      - Navega a la carpeta `backend_flask`.
      - Instala las dependencias de Python: `pip install -r requirements.txt`.
      - Asegúrate de que tu archivo `.env` esté configurado con las credenciales de tu base de datos PostgreSQL.
      - Ejecuta las migraciones: `flask db migrate`, `flask db upgrade`.
      - Inicia el servidor de Flask con `flask run`.

2.  **Configuración del Frontend:**

      - Abre una nueva terminal y navega a la carpeta de tu frontend.
      - Instala las dependencias de Node.js con `npm install`.
      - Inicia el servidor de desarrollo de React con `npm run dev`.

### Opción 2: Con Docker (entorno de contenedores)

Esta opción es ideal para un despliegue rápido. Asegúrate de tener **Docker** instalado.

  - Navega a la carpeta `backend_flask`.
  - Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores:
    ```bash
    docker-compose up --build
    ```
  - Esto iniciará el backend de Flask y el servicio de PostgreSQL en contenedores separados.
