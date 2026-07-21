const router = require("express").Router()


router.get('/',(req,res)=>{
    res.redirect('/homepage')
})

router.get('/employee',(req,res)=>{
    console.log("employee");
    res.render('employee/employeehomepage.ejs')
})





module.exports = router;