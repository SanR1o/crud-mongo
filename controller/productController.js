const Product = require('../models/Product')
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')


exports.createProduct = async (req,res) => {
    try{
        const {name, description, price, stock, category, subcategory} = req.body;

        //validacion campos requeridos
        if(!name || !description || !price || !stock || !category || !subcategory){
            return res.status(400).json({
                success: false,
                message: 'todos los campos son obligatorios'
            });
        }

        //verificar que la categoria existe
        const categoryExist = await Category.findById(category);
        if (!categoryExist){
            return res.status(404).json({
                success: false,
                message: 'la categoria solicitada no existe'
            });
        }

        //verificar que la subcategoria existe y que pertenezca a la categoria
        const subcategoryExist = await Subcategory.findOne({
            _id: subcategory,
            category: category
        });
        if (!subcategoryExist){
            return res.status(400).json({
                success: false,
                message: 'la subcategoria solicitada no existe o no pertenece a la categoria eespecifica'
            });
        }

        //crear el producto sin el createBy temporal
        const product = new Product({
            name, 
            description, 
            price, 
            stock, 
            category, 
            subcategory
            //createdBy se agrega despues de verificar el usuario
        });

        //verificar si el usuario esta disponible en el request
        if(req.user && req.user.id){
            product.createdBy = req.user.id;
        }

        //guardar en la base de datos
        const savedProduct = await product.save();

        //obtener el producto con los datos pedidos con los poblados
        const productWithDetails = await Product.findById(savedProduct._id)
        .populate('category', 'name')
        .populate('subcategory','name');

        return res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: productWithDetails
        });
    } catch (error) {
        console.error('Error en createProduct: ', error);
        //manejo errores de mongoDB
        if(error.code === 11000){
            return res.status(400).json({
                success: false,
                message: 'ya existe un producto con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message:'Error al crear producto',
            error: error.message
        });
    }
};

//consulta de productos
exports.getProducts = async (req,res) => {
    try{
        const products = await Product.find()
        .populate('category', 'name')
        .populate('subcategory','name')
        .sort({createdAt: -1});

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error){
        console.error('Error en createProduct: ', error);
        res.status(500).json({
            success: false,
            message:'Error al crear producto',
            error: error.message
        });
    }
}