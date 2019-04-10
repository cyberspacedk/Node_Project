const express = require('express');
const router = express.Router();
const storecontroller = require('../controllers/storecontroller');

const {catchErrors} = require('../handlers/errorHandlers');
// Do work here
router.get('/', catchErrors(storecontroller.getStores));
router.get('/stores', catchErrors(storecontroller.getStores));
router.get('/add', storecontroller.addStore);
router.post('/add', catchErrors(storecontroller.createStore));
router.post('/add/:id', catchErrors(storecontroller.updateStore));
router.get('/stores/:id/edit', storecontroller.editStore);


module.exports = router;
