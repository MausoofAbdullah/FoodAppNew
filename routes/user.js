var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('user/user', { title: 'new user' });
// });
router.get('/',userController.home)
/* For Home-Page Category */
router.get('/veg', userController.veg)
router.get('/chinese', userController.chinese)
router.get('/special', userController.special)
router.get('/south', userController.south)



router.get('/signup',userController.signup)
router.post('/signup', userController.postSignup)

router.get('/login',userController.login)
router.post('/login', userController.postLogin)


/* For Profile */
router.get('/view-profile/:id',  userController.Profile)
router.post('/edit-profile/:id', userController.editProfile)

router.post('/add-address/:id',  userController.addAddress)
router.get('/delete-address/:userId/:addId',  userController.deleteAddress)
router.post('/get-edit-address',  userController.getEditAddress)
router.post('/post-edit-address',  userController.postAddress)

module.exports = router;
