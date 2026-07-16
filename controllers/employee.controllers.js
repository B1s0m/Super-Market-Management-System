const router = require("express").Router()
const employee=require("./../models/Product")

router.get('/new',(req,res)=>{
    res.render('employee/createProducts.ejs')
})
module.exports = router;