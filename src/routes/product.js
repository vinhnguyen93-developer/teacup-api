const express = require('express');
const multer = require('multer');

const router = express.Router();

const productController = require('../app/controllers/ProductController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post('/create', upload.single('image'), productController.create);
router.get('/create', productController.showCreate);
router.get('/show', productController.showAllProduct);
router.get('/trash', productController.trashProduct);
router.get('/:id/edit', productController.edit);
router.put('/:id', upload.single('image'), productController.update);
router.patch('/:id/restore', productController.restore);
router.delete('/:id', productController.destroy);
router.delete('/:id/force', productController.forceDestroy);

module.exports = router;
