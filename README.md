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

## ¿Qué es un JWT? Pag. "https://jwt.io/"
  - JSON Web Token (JWT) 
  
    Es un estándar abierto (RFC 7519) que define una forma compacta y autónoma de transmitir información de forma segura entre partes como un objeto JSON. Esta información se puede verificar y confiar porque está firmada digitalmente. Los JWT se pueden firmar usando una palabra secreta (con el algoritmo HMAC) o un par de claves públicas / privadas usando RSA o ECDSA.
  
  - ¿Cuándo deberíamos utilizar JSON Web Tokens?

    Autorización: este es el escenario más común para usar JWT. Una vez que el usuario haya iniciado sesión, cada solicitud posterior incluirá el JWT, lo que le permitirá acceder a rutas, servicios y recursos que están autorizados con ese token. El inicio de sesión único es una función que se utiliza ampliamente con JWT en la actualidad, debido a su pequeña sobrecarga y su capacidad para usarse fácilmente en diferentes dominios o servidores distribuidos.

    Intercambio de información: los JWT son una buena forma de transmitir información de forma segura entre varias partes. Debido a que los JWT se pueden firmar, por ejemplo, utilizando pares de claves públicas / privadas, se puede estar seguro de que los remitentes son quienes dicen ser. Además, como la firma se calcula utilizando las cabeceras y el payload, también se puede verificar que el contenido no haya sido manipulado.

## Firmar y verificar tokens
  Instalación de JSON Web Token: 
  ```bash
  npm i jsonwebtoken
  ```
  Para los refresh tokens hay que definir un tiempo de expiración, eso se puede lograr pasando un tercer argumento de configuración a la función sign.

  Documentación para refresh del token: "https://auth0.com/docs/login/configure-silent-authentication" y "https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/"
  Para hacer que expire el token después de un cierto tiempo sería:

  ```javascript
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  ```
  o

  ```javascript
  const jwt = require('jsonwebtoken')

const jwtConfig = {
  expiresIn: '7d',
};
const payload = {
  sub: user.id,
  role: "customer"
}

const token = jwt.sign(payload, process.env.JWTSECRET, jwtConfig)
```

Observaciones:

User es la instancia del usuario obtenido del modelo que tenga la propiedad Id del usuario.
Se utiliza sub por conveniencia porque así lo maneja el standar de JWT pero puede usarse el nombre que uno quiera mas info sobre los claims disponibles aquí

si en expiresIn se pone sólo número entonces lo considera en segundo, pero si es un string entonces deberá llevar la unidad para definir el tiempo de expiración, ejemplo:

60 * 60 === '1h’
60 * 60 * 24 === ‘1d’

pero si por accidente se pone un string sin unidad de tiempo entonces lo tomará como milisegundos:
“60” === “60ms”
