const express = require('express');
const router = express.Router();
const subcategoryController = require('../controller/subcategoryController');
const { check } = require('express-validatior');

//Validaciones
const validateSubcategory = [
    check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('description').not().isEmpty().withMessage('la descripcion es obligatoria'),
    check('category').not().isEmpty().withMessage('la categoria es obligatoria')
];

router.post('/', validateSubcategory, subcategoryController.createSubcategory);
router.get('/', subcategoryController.getSubcategories);
router.get('/:id', subcategoryController.getSubcategoryById);
router.put('/:id', validateSubcategory, subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;