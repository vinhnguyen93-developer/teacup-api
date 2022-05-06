const express = require('express');
const router = express.Router();

const categoryController = require('../app/controllers/CategoryController');

router.post('/create', categoryController.create);
router.get('/', categoryController.show);
router.get('/:id/edit', categoryController.edit);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.destroy);

module.exports = router;
