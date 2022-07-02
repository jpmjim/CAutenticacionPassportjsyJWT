const passport = require('passport');

//lista de estrategias de autenticación que podemos hacer
const LocalStrategy = require('./strategies/local.strategy');
const JwtStrategy = require('./strategies/jwt.strategy');

passport.use(LocalStrategy);
passport.use(JwtStrategy);