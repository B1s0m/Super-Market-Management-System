const router = require("express").Router()
const Products=require("./../models/Product")
const catgoty =require("./../models/Category")
const subcatgoty =require("./../models/Subcategory")
const multer = require("multer")

const path=require("path")

const storage= multer.diskStorage({

    destination:function(req,file,cb){
        cb(null,path.join(__dirname, "../image/product"))
    },
    filename:function (req,file,cb) {
        cb(null,Date.now() + "-" + file.originalname)
        
    }
 })

  
const upload =multer({storage})



router.get('/new',async(req,res)=>{
    const findcategory=await catgoty.find();
    const findsubcategory=await subcatgoty.find();



    res.render('employee/createProducts.ejs',{categories:findcategory,subcategories:findsubcategory})
})

router.post('/new',  upload.any(), async(req,res)=>{
    console.log(req.files);
    console.log(req.session.user._id)
    req.body.createdBy=req.session.user._id;
    console.log(req.body)












    //   const addProducts= await Products.create(req.body)
    res.redirect("/products/new")
})


module.exports = router;