const passport = require('passport');

//lista de estrategias de autenticación que podemos hacer
const LocalStrategy = require('./strategies/local.strategy');

passport.use(LocalStrategy);