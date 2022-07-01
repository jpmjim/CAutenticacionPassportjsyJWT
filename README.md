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

## Hashing de contraseñas con bcryptjs
  El hashing de contraseñas encripta (hashea) el password para poder guardarlo en la base de datos ya que por motivos de seguridad no es recomendado guardar el password en crudo.

  Instalar bcrypt: "npm i bcrypt"

  Para hashear una contraseña usando bcrypt se hace el uso de la función .hash(), esta función recibe como primer parámetro la contraseña y después el número de salt. Esta función devuelve una promesa que se puede manejar con async/await

## Implementando hashing para usuarios
  Para que no se vean las contraseñas al momento de hacer GET de los clientes y de los usuarios, debemos de excluir ese atributo mediante Sequelize. Se realiza de la siguiente manera dentro de nuestros métodos find y findOne del archivo "user.service.js" y "customers.service.js"

## Implemetando login con Passport.js
  Passport.js es una serie de librerías y estrategias que nos brinda para hacer la capa de autenticación, permite generar varias estrategias (twitter, github, facebook, etc.) teniendo un código base para logearnos de diferentes maneras.
  Página "https://www.passportjs.org/"
  - Instalando passport: npm i passport
  - passport-local permite hacer un login básico usando username y password, su instalación es: npm install passport-local
