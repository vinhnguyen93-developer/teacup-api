const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/:id/detail', siteController.showOne);
router.get('/', siteController.show);

module.exports = router;
