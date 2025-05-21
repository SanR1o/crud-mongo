const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');

//Crear subcategoria
exports.createSubcategory = async (req, res) =>{
    try{
        const {name, description, category} = req.body

        //validar que la categoria existe

        const parentCategory = await Category.findById(category);
        if(!parentCategory){
            return res.status(404).json({
                success: false,
                message: 'la categoria no existe',
            });
        }

        const newSubcategory = new Subcategory({
            name: name.trim(),
            description: description.trim(),
            category
        });

        await newSubcategory.save();

        res.status(201).json({
            success: true,
            message: 'Subcategoria creada exitosamente',
            data: newSubcategory
        });

    } catch (error) {
        console.error('error al crear la subcategoria', error);
        if (error.message.includes('duplicate Key') || error.message.includes('Ya existe')){
            return res.status(400).json({
                success: false,
                message: 'ya existe una subcategoria con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear subcategoria'
        });

    }
}