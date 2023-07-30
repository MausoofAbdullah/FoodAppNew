const CategoryModel = require("../models/categoryModel.js");
const productModel = require("../models/productModel.js");
const UserModel = require("../models/userModel.js");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

module.exports = {
  signup: (req, res, next) => {
    // const { username } = req.body;
    // try {
    //     if (req.session.signUpErr) {
    //         res.render("user/user-Signup", { user: true, signUpErr: req.session.errMessage });
    //         req.session.signUpErr = false
    //     } else {
    //         res.render('user/user-Signup', { user: true })
    //     }
    // } catch (error) {
    //     console.log(error);
    //     next(error)
    // }
    res.render("user/user-signup", { user: true });
  },
  // postSignup: async (req, res, next) => {
  //     const {Email,Name} = req.body
  //     const salt = await bcrypt.genSalt(10);
  // const hashedPass = await bcrypt.hash(req.body.password, salt);
  // req.body.password = hashedPass;

  //     const newAdmin = new UserModel({Name,Password:hashedPass,Email,isAdmin:true});
  //     console.log(newAdmin)

  //     try {

  //             const user =  newAdmin.save();
  //             res.redirect('/login')

  //     } catch (error) {

  //     }

  // },
  adminLogin: (req, res, next) => {
    try {
      if (req.session.admin) {
        res.redirect("/admin");
      } else {
        res.render("admin/admin-Login", { layout: "admin-layout" });
      }
    } catch (error) {
      console.log("Error loading login page of admin");
      next(error);
    }
  },
  adminPostLogin: async (req, res, next) => {
    const { Email, Password } = req.body;
    console.log(Email, Password, "dfdf");
    try {
      const admin = await UserModel.findOne({ Email: Email, isAdmin: true });
      console.log(admin, "whi is admin");
      if (admin) {
        const validity = await bcrypt.compare(Password, admin.Password);
        if (!validity) {
          res.redirect("/login");
        } else {
          req.session.adminLoggedIn = true;
          req.session.admin = admin;
          res.redirect("/admin");
        }
      } else {
        res.redirect("/admin/login");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminHomePage: async (req, res, next) => {
    try {
      if (!req.session.admin) {
        res.redirect("/admin/login");
      }
      let totalUsers = await UserModel.find().count();

      let productTotal = await productModel.find().count();
      var adminDetails = req.session.admin;

      res.render("admin/admin-home", {
        admin: "true",
        layout: "admin-layout",
        totalUsers,
        productTotal,
        adminDetails,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminAddProduct: async (req, res, next) => {
    try {
      // var catDetails = await adminHelpers.viewCategory()
      const catDetails = await CategoryModel.find().exec();

      res.render("admin/admin-add-product", {
        layout: "admin-layout",
        catDetails,
        admin: true,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminPostProduct: async (req, res, next) => {
    console.log("product");
    try {
      const Images = [];
      for (i = 0; i < req.files.length; i++) {
        Images[i] = req.files[i].filename;
      }
      req.body.Image = Images;
      // await productHelpers.addProduct(req.body)
      const product = new productModel(req.body);
      console.log(req.body, "product");
      product.save();

      res.redirect("/admin/add-product");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminGetAllProduct: async (req, res, next) => {
    try {
      // var product = await productHelpers.getProduct()
      const product = await productModel.find().exec();
      res.render("admin/admin-all-product", {
        layout: "admin-layout",
        admin: true,
        product,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminDeleteProduct: async (req, res, next) => {
    try {
      let proId = req.params.id;
      const product = await productModel.findOne({ _id: proId });
      console.log(product, "dfdfd");
      var imgDel = product.Image;
      const delet = await productModel.deleteOne({ _id: proId });
      console.log(delet, "what");
      console.log(imgDel);
      if (imgDel) {
        for (i = 0; i < imgDel.length; i++) {
          var imagePath = path.join(
            __dirname,
            "../public/admin/product-Images/" + imgDel[i]
          );
          fs.unlink(imagePath, (err) => {
            if (err) return;
          });
        }
      }
      res.redirect("/admin/all-product");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminEditProduct: async (req, res, next) => {
    try {
      let proId = req.params.id;

      let proDetails = await productModel.findOne({ _id: proId });
      var catDetails = await CategoryModel.find().exec();
      for (let i = 0; i < catDetails.length; i++) {
        if (proDetails.Category == catDetails[i].CategoryName) {
          catDetails[i].flag = true;
        }
      }
      res.render("admin/admin-edit-product", {
        proDetails,
        catDetails,
        layout: "admin-layout",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminPostEdit: async (req, res, next) => {
    try {
      let id = req.params.id;
      let oldImage = null;
      proDetails = req.body;
      const editImg = [];
      for (i = 0; i < req.files.length; i++) {
        editImg[i] = req.files[i].filename;
      }
      req.body.Image = editImg;
      const product = await productModel.findOne({ _id: id });
      if (proDetails.Image.length == 0) {
        proDetails.Image = product.Image;
      } else {
        oldImage = product.Image;
      }
      if (oldImage) {
        for (i = 0; i < oldImage.length; i++) {
          var oldImagePath = path.join(
            __dirname,
            "../public/admin/product-Images/" + oldImage[i]
          );
          fs.unlink(oldImagePath, function (err) {
            if (err) return;
          });
        }
      }
      await productModel.updateOne(
        { _id: id },
        {
          $set: {
            Pname: proDetails.Pname,
            Price: proDetails.Price,
            Description: proDetails.Description,
            Quantity: proDetails.Quantity,
            category: proDetails.Category,
            Image: proDetails.Image,
          },
        }
      );
      res.redirect("/admin/all-product");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  adminUserList: async (req, res, next) => {
    try {
      var showUser = await UserModel.find().exec();
      res.render("admin/admin-userlist", {
        layout: "admin-layout",
        admin: true,
        showUser,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  makeAdmin: async (req, res, next) => {
    try {
      var userID = req.params.id;
      await UserModel.updateOne(
        { _id: userID },
        {
          $set: {
            isAdmin: true,
          },
        }
      );
      res.redirect("/admin/user-list");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  undoAdmin: async (req, res, next) => {
    try {
      var userID = req.params.id;
      await UserModel.updateOne(
        { _id: userID },
        {
          $set: {
            isAdmin: false,
          },
        }
      );
      res.redirect("/admin/user-list");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminCategory: async (req, res, next) => {
    try {
      if (req.session.catError) {
        const catDetails = await CategoryModel.find().exec();
        res.render("admin/admin-Category", {
          layout: "admin-layout",
          admin: true,
          catDetails,
          catError: req.session.catError,
        });
        req.session.catError = false;
      } else {
        const catDetails = await CategoryModel.find().exec();

        res.render("admin/admin-Category", {
          layout: "admin-layout",
          catDetails,
          admin: true,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  adminPostCategory: async (req, res, next) => {
    const category = new CategoryModel(req.body);
    const { CategoryName } = req.body;
    try {
      const catExists = await CategoryModel.findOne({ CategoryName });

      if (catExists) {
        req.session.catError = "Category already exist";
        res.redirect("/admin/category");
      } else {
        category.save();
        res.redirect("/admin/category");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  logout: (req, res) => {
    try {
      req.session.adminLoggedIn = false;
      req.session.admin = null;
      res.redirect("/admin/login");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
