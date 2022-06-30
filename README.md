# Curso de Backend con Node.js: Autenticación con Passport.js y JWT

## Tienda en línea: instalación del proyecto
  - Clonamos el proyecto y instalamos las dependencias:
    
    ```bash
    $ git clone git@github.com:platzi/curso-nodejs-auth.git
    $ npm install
    ```
  - Configuracion del entorno con varibles de entorno, los accesos.
  - Levantar nuestra base de datos en postgres que debe tener su volumen ya configurada y el pgadmin para manera grafica.

    ```bash
    $ docker-compose up -d postgres
    $ docker-compose up -d pgadmin "localhost:5050"
    $ docker ps "verificamos los contenedores"
    $ docker inspect "id del contenedor para tener mas informacion"
    $ npm run migrations:run "corremos nuestra primera migracion para enviar las tablas a la base de datos"
    $ npm run dev "probamos los endpoints en insomnia"
    ```
  - Dentro de insomnia podemos manejar tipos de ambientes "prod" y "dev"

## Middleware de verificación
  Se crea un middleware para hacer verificaciones. es decir, una capa de autenticación.
  El middleware tendrá al siguiente lógica:

  ```javascript
  if (req.headers['api'] === '123') {
    next();
  } else {
    next(boom.unauthorized());
  }
  ```
  Es decir, en los headers se enviará una api con un valor (api key) que deberá ser igual a un valor o una variable que esté manejada por las variables de entorno. Si todo es correcto hará next(), es decir, dejamos que ingrese a la capa de servicios o ejecutar los siguientes middlewares, de lo contrario arrojará un error unauthorized.