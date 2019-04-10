const express = require('express');
const router = express.Router();
const storecontroller = require('../controllers/storecontroller');
const userController = require('../controllers/userController');

const {catchErrors} = require('../handlers/errorHandlers');
// Do work here
router.get('/', catchErrors(storecontroller.getStores));
router.get('/stores', catchErrors(storecontroller.getStores));
router.get('/add', storecontroller.addStore);

router.post('/add', storecontroller.upload, catchErrors(storecontroller.resize), catchErrors(storecontroller.createStore)
);
router.post('/add/:id', 
storecontroller.upload, catchErrors(storecontroller.resize),
catchErrors(storecontroller.updateStore));

router.get('/stores/:id/edit', storecontroller.editStore);

router.get('/store/:slug', catchErrors(storecontroller.getStoreBySlug) )

router.get('/tags/', catchErrors(storecontroller.getStoresByTag) )
router.get('/tags/:tag', catchErrors(storecontroller.getStoresByTag) );

router.get('/login', userController.loginForm);

router.get('/register', userController.registerForm); 

router.post('/register', userController.validateRegister,  userController.register );

module.exports = router;
