# --- Etapa 1: Preparación del Entorno ---

# Usa una imagen base oficial de Python.
# Python:3.10-slim-buster es una buena elección porque es una imagen ligera, lo que reduce el tamaño del contenedor.
FROM python:3.10-slim-buster

# Establece el directorio de trabajo dentro del contenedor.
# Todas las instrucciones posteriores (COPY, RUN, etc.) se ejecutarán en este directorio.
WORKDIR /app

# --- Etapa 2: Instalación de Dependencias ---

# Copia solo el archivo de dependencias primero para aprovechar el cache de Docker.
# Si requirements.txt no cambia, Docker no volverá a ejecutar la instalación de pip.
COPY requirements.txt .

# Instala las librerías de Python.
# --no-cache-dir: evita que pip guarde el cache, lo que ayuda a mantener la imagen más pequeña.
RUN pip install --no-cache-dir -r requirements.txt

# --- Etapa 3: Copia de la Aplicación ---

# Copia el resto del código de tu aplicación al directorio de trabajo en el contenedor.
COPY . .

# --- Etapa 4: Configuración de la Ejecución ---

# EXPONE el puerto 5000 para que la aplicación sea accesible desde fuera del contenedor.
# Esto es solo una declaración de metadatos, no una configuración de red real.
EXPOSE 5000

# Define variables de entorno para Flask.
# FLASK_APP: indica a Flask cuál es el archivo principal de la aplicación.
# FLASK_RUN_HOST: necesario para que el servidor escuche en todas las interfaces de red dentro del contenedor.
ENV FLASK_APP=app.py  
ENV FLASK_RUN_HOST=0.0.0.0

# --- Etapa 5: Comando de Inicio del Contenedor ---

# CMD define el comando por defecto que se ejecuta cuando se inicia el contenedor.
# Se usa gunicorn, un servidor web de producción, en lugar del servidor de desarrollo de Flask.
# gunicorn: Un servidor web WSGI (Web Server Gateway Interface) para Python.
# --bind 0.0.0.0:5000: configura gunicorn para escuchar en todas las IPs en el puerto 5000.
# "app:app": el primer 'app' se refiere al módulo (archivo app.py), y el segundo 'app' a la instancia de la aplicación Flask dentro de ese módulo.

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
