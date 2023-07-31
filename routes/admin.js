const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/admin/product-Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });
/* For Admin Session  */
const verifyAdmin = ((req, res, next) => {
  if (req.session.admin) {
    next()
  } else {
    res.redirect('/admin/login')
  }
})

// for signup
// router.get('/signup',adminController.signup)
// router.post('/signup', adminController.postSignup)
router.get("/login", adminController.adminLogin);
router.post("/login", adminController.adminPostLogin);

router.get("/",verifyAdmin , adminController.adminHomePage);

/* For Product */
router.get("/add-product",verifyAdmin , adminController.adminAddProduct);
router.post(
  "/add-product",
  upload.array("Image", 1),
  adminController.adminPostProduct
);
router.get("/all-product", adminController.adminGetAllProduct);
// router.get('/product-View-More/:id',  adminController.adminProductViewMore)
router.get("/delete-product/:id", adminController.adminDeleteProduct);
router.get("/edit-product/:id", adminController.adminEditProduct);
router.post(
  "/edit-product/:id",
  upload.array("Image", 3),
  adminController.adminPostEdit
);

/* GET users listing. */
router.get("/user-list", verifyAdmin ,adminController.adminUserList);
router.get("/make-admin/:id",verifyAdmin , adminController.makeAdmin);
router.get("/undo-admin/:id",verifyAdmin , adminController.undoAdmin);

/* For Add-Category */
router.get("/category",verifyAdmin , adminController.adminCategory);
router.post("/category",verifyAdmin , adminController.adminPostCategory);

// for logout
router.get("/logout", adminController.logout);

module.exports = router;
