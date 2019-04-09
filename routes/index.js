const express = require('express');
const router = express.Router();
const storecontroller = require('../controllers/storecontroller');

const {catchErrors} = require('../handlers/errorHandlers');
// Do work here
router.get('/', storecontroller.homePage);
router.get('/add', storecontroller.addStore);
router.post('/add', catchErrors(storecontroller.createStore));

module.exports = router;
