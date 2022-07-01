const jwt = require('jsonwebtoken');

const secret = 'myCat';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY1NjcxNjgzOX0.alxrP8ikX05IY3XadToGBP3OnlF9KakKeGVjl1kpJXA';

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload);

//Ejecutamos el código y vemos el resultado de verificar el token: en la terminal nos muestra el payload del token.