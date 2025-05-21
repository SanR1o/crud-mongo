const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

router.post('/', categoryController.createCategory);
router.post('/', categoryController.deleteCategory);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id',categoryController.deleteCategory);

module.exports = router;