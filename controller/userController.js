const UserModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const bcrypt = require("bcrypt");
module.exports = {
  signup: (req, res, next) => {
    try {
      if (req.session.signUpErr) {
        res.render("user/user-Signup", {
          user: true,
          signUpErr: req.session.errMessage,
        });
        req.session.signUpErr = false;
      } else {
        res.render("user/user-Signup", { user: true });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
    //   res.render('user/user-signup',{user:true} )
  },
  postSignup: async (req, res, next) => {
    const { Email } = req.body;

    const oldUser = await UserModel.findOne({ Email });
    if (oldUser) {
      req.session.signUpErr = true;
      req.session.errMessage = "Email already exist";
      res.redirect("/signup");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.Password, salt);
    req.body.Password = hashedPass;

    try {
      const newUser = new UserModel(req.body);

      const user = newUser.save();
      res.redirect("/login");
    } catch (error) {}
  },

  home: async (req, res, next) => {
    try {
      var userDetails = req.session.user;

      const proDetails = await productModel.find().exec();

      res.render("user/user-Home", { user: true, userDetails, proDetails });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  veg: async (req, res, next) => {
    try {
      const productByCat = await productModel.find({ category: "veg" }).exec();

      res.render("user/user-Category", { productByCat, user: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  chinese: async (req, res, next) => {
    try {
      const productByCat = await productModel
        .find({ category: "chinese" })
        .exec();
      res.render("user/user-Category", { productByCat, user: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  special: async (req, res, next) => {
    try {
      const productByCat = await productModel
        .find({ category: "special" })
        .exec();
      res.render("user/user-Category", { productByCat, user: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  south: async (req, res, next) => {
    try {
      const productByCat = await productModel
        .find({ category: "south" })
        .exec();
      res.render("user/user-category", { productByCat, user: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  productDetail: async (req, res, next) => {
    try {
      var userDetails = req.session.user;
      var id = req.params.id;

      var proDetails = await productModel.findOne({ _id: id });
      res.render("user/user-singleProduct", {
        user: true,
        proDetails,
        userDetails,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  login: async (req, res, next) => {
    res.render("user/user-login", { user: true });
  },
  postLogin: async (req, res, next) => {
    const { Email, Password } = req.body;

    try {
      const user = await UserModel.findOne({ Email: Email });
      if (user) {
        const validity = await bcrypt.compare(Password, user.Password);

        // validity?res.status(200).json(user):res.status(400).json("wrong Password")
        if (!validity) {
          res.redirect("/login");
        } else {
          req.session.loggedIn = true;
          req.session.user = user;

          res.redirect("/");

          // console.log(user,"gap",token,"login");
        }
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  Profile: async (req, res, next) => {
    const id = req.params.id;
    try {
      var userDetails = req.session.user;
      if (userDetails) {
        const user = await UserModel.findById(id);

        res.render("user/user-profile", { user: true, userDetails, user });
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  editProfile: async (req, res, next) => {
    try {
      let id = req.params.id;
      let userData = req.body;
      await UserModel.updateOne(
        { _id: id },
        {
          $set: {
            Name: userData.Name,
            Email: userData.Email,
            Password: userData.Password,
          },
        }
      );
      res.redirect("/view-profile/" + req.params.id);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  addAddress: async (req, res, next) => {
    try {
      await userHelpers.addAddress(req.params.id, req.body);
      res.redirect("/view-profile/" + req.params.id);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteAddress: (req, res, next) => {
    try {
      userId = req.params.userId;
      addId = req.params.addId;
      userHelpers.deleteAddress(userId, addId);
      res.redirect("/view-profile/" + req.params.userId);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getEditAddress: async (req, res, next) => {
    try {
      let response = await userHelpers.getAddress(
        req.body.userId,
        req.body.addressId
      );
      res.json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  postAddress: async (req, res, next) => {
    try {
      var userId = req.body.userId;
      var addId = req.body.addressId;
      let response = await userHelpers.editAddress(userId, addId, req.body);
      res.json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  logout: (req, res) => {
    try {
      req.session.loggedIn = false;
      req.session.user = null;
      res.redirect("/");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
