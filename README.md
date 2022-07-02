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

## Generar JWT en el servicio
  Al implementar JWT ya no es necesario enviar los datos del usuario en la petición, ya que por medio del payload del token podemos enviarla, ademas recordar que por ningún motivo se debe enviar informacion sensible del usuario.
  Para generar nuestro SECRET nos vamos a "https://www.allkeysgenerator.com/" o "http://keygen.io/" donde lo añadiremos en nuestras varibles de entorno.

## Protección de rutas
  Documentación de la clase "https://www.passportjs.org/packages/passport-jwt/"
  Instalación 
  ```bash
  npm i passport-jwt
  ```
  Este módulo le permite autenticar puntos finales mediante un token web JSON. Está destinado a ser utilizado para asegurar puntos finales RESTful sin sesiones.

  Reto progeter las demas rutas con JWT
  Una forma para proteger todas las rutas de /categories sin agregar el middleware en cada uno de los métodos.
  ```javascript
  router.use('/categories', passport.authenticate('jwt', { session: false }), categoriesRouter);
  ```
## Control de roles
  Gestion de permisos en cada respectivo rol dentro de la aplicación.
  Para crear un control de roles, un middleware será nuestro mejor amigo
  En primer lugar, pensemos en lo que necesitamos, necesitamos un middleware capaz de verificar qué tipo de usuarios están autenticados, para esto, creemos una sola función, que recibirá una lista de roles y devolverá un middleware. "Dentro del  proyecto tenemos un gestion basica"

  Debemos utilizar accesscontrol para mas avanzado en gestion de permisos
  "npm i accesscontrol --save"
  https://www.npmjs.com/package/accesscontrol
  ```javascript
  const accessControl = require('accesscontrol');
  const ac = accessControl({
    debug: true,
    mode: 'restrictive',
    ownerField: 'owner',
    owner: 'admin',
    defaultRole: 'guest',
    roles: [
      {
        name: 'guest',
        inherit: ['read'],
      },
      {
        name: 'user',
        inherit: ['read', 'create', 'update'],
      },
      {
        name: 'admin',
        inherit: ['read', 'create', 'update', 'delete'],
      },
    ],
  });
  ```

## Obteniendo órdenes del perfil
  Para poder ver las órdenes de compra de un usuario podemos usar el token que tiene, obtener el sub y obtener la información directamente sin necesidad de enviar el ID del usuario.

  Se crea un nuevo método en el servicio orders, el método findByUser recibe el userId y realiza una consulta respecto a éste donde se incluye la asociación de user y customer, y se desea obtener el id del customer ya que únicamente se cuenta con el id de usuario, es por ello que se utiliza where: {'$customer.user.id$': userId}, es decir, le estamos diciendo a qué asociaciones estamos haciendo la consulta.
  Más información sobre este tipo de consultas https://sequelize.org/master/manual/eager-loading.html#complex-where-clauses-at-the-top-level

## Cómo enviar emails con Node.js
  Para hacer la recuperación de contraseñas se utilizará la librería Nodemailer, el comando de instalación es npm install nodemailer.
  Pag:"http://nodemailer.com/about/"
  Instalación
  ```bash
  npm install nodemailer
  ```
  Ejecutamos desde la temrinal "node nodemailer.js"

  Ethereal: "https://ethereal.email/" El servicio de correo se usa para enviar correos electrónicos, es un servicio gratuito que le brinda una dirección de correo electrónico que puede usar para enviar correos electrónicos desde su aplicación.

  Para enviar emails se utiliza la función sendMail, la cual recibe como argumento un objeto con la información del email.

  ```javascript
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '
      password: '
    }
  });
  const mailOptions = {
    from: '
    to: '
    subject: '
    text: '
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  ```
## Implementando el envío de emails
  Debido a que hay mucha lógica regada sobre autenticación, se crea un nuevo servicio para auth y hacer esto más mantenible.
  auth.service.js, el método getUser contiene la lógica para autenticar un usuario, signToken contiene la lógica para firmar un token y sendMail contiene la lógica para enviar un email 