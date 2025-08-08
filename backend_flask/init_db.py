from app import app, db
from dotenv import load_dotenv
load_dotenv() 

with app.app_context():
    db.create_all() # <-- Esta es la línea clave
    print("Tablas de la base de datos creadas/actualizadas.")


  