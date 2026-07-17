const router = require("express").Router()
const Products=require("./../models/Product")
const catgoty =require("./../models/Category")
const subcatgoty =require("./../models/Subcategory")
router.get('/new',async(req,res)=>{
    const findcategory=await catgoty.find();
    const findsubcategory=await subcatgoty.find();



    res.render('employee/createProducts.ejs',{categories:findcategory,subcategories:findsubcategory})
})
router.post('/new', async(req,res)=>{
    console.log(req.session.user._id)
    req.body.createdBy=req.session.user._id;
    console.log(req.body)
    //   const addProducts= await Products.create(req.body)
    res.redirect("/products/new")
})


module.exports = router;