const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { User } = require('../models/User');

console.log('[AuthJWT] Configuracion cargada: ', config.secret ? '***' + config.secret.slice(-5) : 'NO CONFIGURACION');

//Definicion del middleware
const verifyTokenFn = (req, res, next) => {
    console.log('\n[AuthJWT] Middleware ejecutandose para: ', req.originalUrl);

    try{
        const token = req.headers['x-access-token'] || req.headers.authorization?.split(' ')[1];
        console.log('[AuthJWT] Token recibido: ', token ? '***' + token.slice(-8) : 'NO PROVISTO');

        if(!token){
            console.log('[AuthJWT] Error: Token no proporcionado');
            return res.status(403).json({
                succes: false,
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, config.secret);
        req.user.id = decoded.id;
        req.user.Role = decoded.role;
        console.log('[AuthJWT] Token valido para: ', decoded.email);
        next();
    } catch (error) {
        console.log('[AuthJWT] Error: ', error.name, '_', error.message);
        return res.status(401).json({
            succes: false,
            message: 'Token invalido',
            error: error.name
        });
    }
};

const AuthJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalido'
        });
    }
};