const router = require("express").Router()
const Products=require("./../models/Product")

router.get('/new',(req,res)=>{
    res.render('employee/createProducts.ejs')
})
router.post('/new', async(req,res)=>{
    console.log(req.session.user._id)
    req.body.createdBy=req.session.user._id;
    console.log(req.body)
    //   const addProducts= await Products.create(req.body)
    res.redirect("/products/new")
})


module.exports = router;