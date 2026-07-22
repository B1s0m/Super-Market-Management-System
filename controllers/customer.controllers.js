const router = require("express").Router()

const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");









router.get('/homepage', async (req, res) => {
    const countCatgoty = await Category.find()
    // gt mean greate than      sort large → small
    const offers = await Product.find({ discount: { $gt: 0 } }).sort({ discount: -1 }).limit(4)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        });
    // console.log(offers);
    //   console.log("----------------------------featuredProducts---------------");
    const featuredProducts = await Product.find().sort({ views: -1 }).limit(4)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        });

    // console.log(featuredProducts);
    console.log("----------------------------newArrivals---------------");
    const newArrivals = await Product.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        });

    // console.log(newArrivals);  
    //         }); 
    res.render('customer/customerHome.ejs', { offers, newArrivals, featuredProducts, countCatgoty })
    //  res.render("customer/prodectdetails.ejs")
})



router.get("/categoryviews/:id", async (req, res) => {
    try {

        const categoryId = req.params.id;

        console.log(categoryId);
        // Find the category
        const foundCategory = await Category.findById(categoryId);

        if (!foundCategory) {
            return res.status(404).send("Category not found");
        }
        //   Get all subcategories
        const subcategories = await Subcategory.find({
            category: categoryId
        });
        // this  get only id
        const subcategoryIds = subcategories.map(
            subcategory => subcategory._id
        );

        const limit = 10;
        const page = Number(req.query.page) || 1;

        const skip = (page - 1) * limit;





        //  Get all Products has same id 
        const products = await Product.find({
            subcategory: {
                $in: subcategoryIds
            }
        }).skip(skip).limit(limit).populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        });

        console.log(products);

        const totalProducts = await Product.countDocuments({
            subcategory: {
                $in: subcategoryIds
            }
        });
        const totalPages = Math.ceil(totalProducts / limit);

        res.render("customer/sebcategoryview.ejs", {
            category: foundCategory,
            subcategories,
            products,
            totalPages,
            page, totalProducts
        });

    } catch (error) {
        console.log("Error loading category:", error);

        res.status(500).send("Failed to load category page");
    }
});


router.get("/details/:id", async (req, res) => {
    try {

        const productId = req.params.id;

        const product = await Product.findById(productId)
            .populate({
                path: "subcategory",
                populate: {
                    path: "category"
                }
            });

      

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("customer/prodectdetails.ejs", {
            product 
        });

    } catch (error) {
        console.log("Error loading product:", error);

        res.status(500).send("Failed to load product page");
    }
});

module.exports = router;