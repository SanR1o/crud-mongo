const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config')

//Roles del sistema
const ROLES = {
    ADMIN: 'admin',
    COORDINADOR: 'coordinador',
    AUXILIAR: 'auxiliar',
};

//funciones para verificar permisos
const checkPermission = (UserRole, allowedRoles) => {
    return allowedRoles.includes(UserRole);
};

//Registro de usuarios (SOLO ADMIN)
exports.signup = async (req, res) => {
    try{
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password,8),
            role: req.body.role || 'auxiliar'
        });

        const savedUser = await user.save();

        const token = jwt.sign({id:savedUser._id}, config.secret, {

        });

        res.status(200).json({
            success: true,
            message:'Usuario registrado exitosamente',
            token: token,
            user: savedUser
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message:'Error al registrar el usuario',
            error: error.message
        });
    }
}

//Login para todos
exports.signin = async (req, res) => {
    try{
        console.log('[AuthController] Body recibido: ', req.body);

        //validaciones de campos requeridos
        if((!req.body.username && ! req.body.email) || !req.body.password) {
            console.log('[AuthController] campos faltantes: ',{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password ? '***' : 'NO PROVISTO'
            });
            return res.status(400).json({
                success: false,
                message:'Se requieren todos los campos'
            });
        }

        //buscar usuario cpn todos los campos necesarios
        const user = await User.findOne({
            $or: [
                {username: req.body.username},
                {email: req.body.email}
            ]
        }).select('+password');

        if(!user){
            console.log('[AuthController] Usuario no encontrado');
            return res.status(404).json({
                success: false,
                message:'Usuario no encontrado'
            });
        }

        //Validar que el usuario tenga contraseña
        if(!user.password){
            console.log('[AuthController] Usuario sin contraseña');
            return res.status(500).json({
                success: false,
                message:'Error en la configuración del usuario'
            });
        }
    } catch(error) {
        res.status(500).json({
            success: false,
            message:'Error al loggear',
            error: error.message
        });
    }
};