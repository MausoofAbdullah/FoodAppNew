const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

const verifyUser = (async (req, res, next) => {
    if (req.session.user) {
      
        next()
    
    } else {
      res.redirect('/login')
    }
  })

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('user/user', { title: 'new user' });
// });
router.get("/", userController.home);

/* For Home-Page Category */
router.get("/veg", userController.veg);
router.get("/chinese", userController.chinese);
router.get("/special", userController.special);
router.get("/south", userController.south);

// single product view
router.get("/product-details/:id", userController.productDetail);

// route for signup
router.get("/signup", userController.signup);
router.post("/signup", userController.postSignup);

// route for login
router.get("/login", userController.login);
router.post("/login", userController.postLogin);

/* For Profile */
router.get("/view-profile/:id", userController.Profile);
router.post("/edit-profile/:id", userController.editProfile);

// for logout
router.get("/logout", userController.logout);

module.exports = router;
