const User = require('../models/User');
const bcrypt = require('bcryptjs');

//obtener todos los usuarios solo admin
exports.getAllUsers = async  (req, res) => {
    console.log('[CONTROLLER] Ejecutando getAllUsers');
    try{
        const users = await User.find().select('password');
        console.log('[CONTROLLER] Ejecutando getAllUsers: usuarios encontrados', users.length);
        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('[CONTROLLER] Error en getAllUsers: ', error.message);
        res.status(500).json({
            success: false,
            message:'Error en obtener todos los usuarios',
            //error: error.message
        });
    }
};

//obener usuario especifico
exports.getUserById = async  (req, res) => {
    try{
        const user = await User.findById(req.params.id).select('-password');

        if(!user){
            return res.status(404).json({
                success: false,
                message:'Usuario no encontrado'
            });
        }

        //validaciones de acceso
        if (req.user.role === 'auxiliar' && req.user.id!== user.id.toString()){
            return res.status(403).json({
                success: false,
                message:''
            });
        }

        if(req.user.role === 'coordinador' && user.role === 'admin' ){
            return res.status(403).json({
                success: false,
                message:'NO puedes ver usuarios admin'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Error en getUserById: ', error);
        res.status(500).json({
            success: false,
            message:'Error al encontrar al usuario especificado',
            error: error.message
        });
    }
};

//crear usuario
exports.createUser = async  (req, res) => {
    try{
        const {username, email, password, role} = req.body;

        const user = new User({
            username, 
            email, 
            password: await bcrypt.hash(password, 10), 
            role
        });

        const savedUser = await user.save();

        res.status(201).json({
            success: true,
            message: 'Usuario creado',
            user:{
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                password: savedUser.password,
                role: savedUser.role
            }
        });

    } catch (error) {
        console.error('Error en createUser: ', error);
        res.status(500).json({
            success: false,
            message:'Error al crear usuario',
            error: error.message
        });
    }
};

//actualizar usuario
exports.updateUser = async  (req, res) => {
    try{
        const updateUser = await User.findByIdAndUpdate(req.params.id,
            {$set: req. body},
            {new: true }
        ).select('-password');

        if(!updateUser){
            return res.status(404).json({
                success: false,
                message:'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado'
        });

    } catch (error) {
        console.error('Error en updateUser: ', error);
        res.status(500).json({
            success: false,
            message:'Error al actualizar el usuario',
            error: error.message
        });
    }
};

//elimninar usuario
exports.deleteUser = async  (req, res) => {
    console.log('[CONTROLLER] ejecutando deleteUser por id: ', req.params.id)
    try{
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            console.log('[CONTROLLER] ejecutando deleteUser: usuario no encontrado')
            return res.status(404).json({
                success: false,
                message: 'usuario no encontrado'
            });
        }

        console.log('[CONTROLLER] ejecutando deleteUser: usuario eliminado: ', deleteUser._id);
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            data: deleteUser
        });

    } catch (error) {
        console.error('Error en deleteUser: ', error);
        res.status(500).json({
            success: false,
            message:'Error al eliminar el usuario',
            error: error.message
        });
    }
};