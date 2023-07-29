const CategoryModel=require("../models/categoryModel.js")
const productModel=require('../models/productModel.js')
const UserModel = require("../models/userModel.js")

let adminlogin = {
    username: 'mausoofabdullah@gmail.com',
    password: "123456"
}
module.exports = {
    adminLogin: (req, res, next) => {
        try {
            if (req.session.admin) {
                res.redirect('/admin')
            } else {
                res.render('admin/admin-Login', { layout: 'admin-layout' });
            }
        } catch (error) {
            console.log("Error loading login page of admin")
            next(error)
        }

    },
    adminPostLogin: async (req, res, next) => {
        try {
            let data = req.body
            console.log(data,"ffdf")
            if (data.Username == adminlogin.username) {
                if (data.Password == adminlogin.password) {
                    req.session.adminLoggedIn = true
                    req.session.admin = data
                    res.redirect('/admin')
                } else {
                    res.redirect('/admin/login')
                }
            } 
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    adminHomePage: async (req, res, next) => {
        try {
            // let totalRevenue = await adminHelpers.totalReport()
            // let totalUsers = await adminHelpers.totalUsers()
            // let ordersTotal = await adminHelpers.orderReport()
            // let productTotal = await adminHelpers.totalProduct()
            // var adminDetails = req.session.admin
            res.render('admin/admin-home', { admin:'true', layout: 'admin-layout' });
        } catch (error) {
            console.log(error)
            next(error)
        }

    },
    adminAddProduct: async (req, res, next) => {
        try {
            // var catDetails = await adminHelpers.viewCategory()
            const catDetails = await CategoryModel.find().exec();

            res.render('admin/admin-add-product', { layout: 'admin-layout',catDetails,admin:true });
        } catch (error) {
            console.log(error)
            next(error)
        }

    },
    adminPostProduct: async (req, res, next) => {
        console.log("product")
        try {
            const Images = []
            for (i = 0; i < req.files.length; i++) {
                Images[i] = req.files[i].filename
            }
            req.body.Image = Images
            // await productHelpers.addProduct(req.body)
        const product= new productModel(req.body)
        console.log(req.body,"product")
        product.save()

            res.redirect('/admin/add-product')
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    adminGetAllProduct: async (req, res, next) => {
        try {
            // var product = await productHelpers.getProduct()
            const product=await productModel.find().exec()
            res.render('admin/admin-all-product', { layout: 'admin-layout', admin: true, product });
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    adminDeleteProduct: (req, res, next) => {
        try {
            let proId = req.params.id
            var imgDel = productHelpers.deleteProduct(proId)
            console.log(imgDel);
            if (imgDel) {
                for (i = 0; i < imgDel.length; i++) {
                    var imagePath = path.join(__dirname, '../public/admin/product-Images/' + imgDel[i])
                    fs.unlink(imagePath, (err) => {
                        if (err)
                            return
                    })
                }
            }
            res.redirect('/admin/all-product')
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    adminEditProduct: async (req, res, next) => {
        try {
            let proDetails = await productHelpers.productDetails(req.params.id)
            var catDetails = await adminHelpers.viewCategory()
            for (let i = 0; i < catDetails.length; i++) {
                if (proDetails.Category == catDetails[i].CategoryName) {
                    catDetails[i].flag = true
                }
            }
            res.render('admin/admin-Edit-product', { proDetails, catDetails, layout: 'admin-layout' })
        } catch (error) {
            console.log(error);
            next(error)
        }

    },
    adminPostEdit: async (req, res, next) => {
        try {
            let id = req.params.id
            const editImg = []
            for (i = 0; i < req.files.length; i++) {
                editImg[i] = req.files[i].filename
            }
            req.body.Image = editImg
            var oldImage = await productHelpers.productUpdate(id, req.body)
            if (oldImage) {
                for (i = 0; i < oldImage.length; i++) {
                    var oldImagePath = path.join(__dirname, '../public/admin/product-Images/' + oldImage[i])
                    fs.unlink(oldImagePath, function (err) {
                        if (err)
                            return
                    })
                }
            }
            res.redirect('/admin/all-product')
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    adminProductViewMore: async (req, res, next) => {
        try {
            id = req.params.id
            proDetails = await productHelpers.productDetails(id)
            catDetails = await adminHelpers.viewCategory()
            res.render('admin/admin-ViewMore-product', { proDetails, catDetails })
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    adminUserList: async (req, res, next) => {
        try {
            var showUser = await UserModel.find().exec()
            res.render('admin/admin-userlist', { layout: 'admin-layout', admin: true, showUser })
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    adminCategory: async (req, res, next) => {
        try {
            if (req.session.catError) {
                const catDetails = await CategoryModel.find().exec()
                res.render('admin/admin-Category', { layout: 'admin-layout', admin: true, catDetails, catError: req.session.catError })
                req.session.catError = false
            } else {
                const catDetails = await CategoryModel.find().exec();

                res.render('admin/admin-Category', { layout: 'admin-layout',catDetails, admin: true, })
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    adminPostCategory: async (req, res, next) => {
        const category= new CategoryModel(req.body)
        const {CategoryName}=req.body
        try {
            
    const catExists = await CategoryModel.findOne({ CategoryName });


            if (catExists) {
                req.session.catError = "Category already exist"
                res.redirect('/admin/category')
            } else {
                category.save()
                res.redirect('/admin/category')
            }
        } catch (error) {
            console.log(error);
            next(error)
        }

    },
    logout: (req, res) => {
        try {
            req.session.adminLoggedIn = false
            req.session.admin = null
            res.redirect('/admin/login')
        } catch (error) {
            console.log(error);
            next(error)
        }

    }
}