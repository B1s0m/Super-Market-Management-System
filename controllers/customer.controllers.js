const router = require("express").Router()

const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");









router.get('/homepage', async (req, res) => {
    // const countCatgoty= await Category.find()
    // const getallproducts = await Product.find().populate({
    //     path: "subcategory",
    //     populate: {
    //         path: "category"
    //     }
    // });
            // getallproducts.forEach((k,v) => {
            //     // console.log(k +" "+ v);
            //     console.log(k.subcategory.category.name );

                
            // }); 
    //    console.log("-----------------------------------");
    //   countCatgoty.forEach((k,v) => {
    //             // console.log(k +" "+ v);
    //             console.log(k.name );    
    //         }); 
    //  res.render('customer/customerHome.ejs', {getallproducts,countCatgoty})
     res.render("customer/prodectdetails.ejs")
})


// router.get('/categoryviews/:id', async (req, res) => {
 
//        console.log(req.params.id);

//         const category = await Category.findById(req.params.id);
//        if (!category) {
//             return res.status(404).send("Category not found");
//         }
//         const subcategories = await subcategories.find({
//             category: categoryId
//         });
//         const subcategoryIds = subcategories.map(
//             subcategory => subcategory._id
//         );

//     const products = await Product.find({
//             subcategory: {
//                 $in: subcategoryIds
//             }
//         }).populate({
//             path: "subcategory",
//             populate: {
//                 path: "category"
//             }
//         });

           

//              res.render("customer/sebcategoryview.ejs", {
//             category,
//             subcategories,
//             products
//         });

// })


router.get("/categoryviews/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;

        console.log(categoryId);

        const foundCategory = await Category.findById(categoryId);

        if (!foundCategory) {
            return res.status(404).send("Category not found");
        }

        const subcategories = await Subcategory.find({
            category: categoryId
        });

        const subcategoryIds = subcategories.map(
            subcategory => subcategory._id
        );

        const products = await Product.find({
            subcategory: {
                $in: subcategoryIds
            }
        }).populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        });

        res.render("customer/sebcategoryview.ejs", {
            category: foundCategory,
            subcategories,
            products
        });

    } catch (error) {
        console.log("Error loading category:", error);

        res.status(500).send("Failed to load category page");
    }
});





module.exports = router;