const router = require("express").Router()
const Products = require("./../models/Product")
const catgoty = require("./../models/Category")
const subcatgoty = require("./../models/Subcategory")
const multer = require("multer")

const path = require("path")

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../image/product"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)

    }
})


const upload = multer({ storage })



async function findAllCategories() {
    const categories = await catgoty.find();
    const subcategories = await subcatgoty.find();

    return { categories, subcategories };
}




router.get('/new', async (req, res) => {

    const { categories, subcategories } = await findAllCategories();
    res.render('employee/createProducts.ejs', { categories: categories, subcategories: subcategories, error: null, success: null, oldData: null })
})
// this for add prodect 
router.post('/new', upload.any(), async (req, res) => {

    //     the file will send like down format
    // console.log(req.files);
    //   {
    //     fieldname: 'variants[0][image]',
    //     originalname: 'Screenshot (20).png',
    //     encoding: '7bit',
    //     mimetype: 'image/png',
    //     path: 'C:\\Users\\PC\\Desktop\\Ga\\projectSuperMarketManagementSystem\\image\\product\\1784444739385-Screenshot (20).png',
    //     destination: 'C:\\Users\\PC\\Desktop\\Ga\\projectSuperMarketManagementSystem\\image\\product',
    //     filename: '1784444739385-Screenshot (20).png',
    //     size: 4963779
    //   },


    if (!req.body || !req.files || (!req.body.category && !req.body.newCategory) || !req.body.variants) {
        const { categories, subcategories } = await findAllCategories();
        return res.render("employee/createProducts.ejs", {
            error: " you missing some input fields", categories: categories, subcategories: subcategories
            , success: null,
            oldData: req.body

        });
    }


    if (!req.body.category && !req.body.subcategory) {
        try {
            console.log(req.body.newCategory);
            console.log(req.body.newSubcategory);
            const newCategory = await catgoty.create({
                name: req.body.newCategory
            })
            const newSubcategory = await subcatgoty.create({ name: req.body.newSubcategory, category: newCategory._id })

            req.body.category = newCategory._id
            req.body.subcategory = newSubcategory._id

            console.log("first conditaion " + req.body.newCategory);
            console.log("first conditaion  " + req.body.newSubcategory);

        } catch (error) {
            console.log(" this error in first conditaion " + error);
            const { categories, subcategories } = await findAllCategories();
            return res.render("employee/createProducts.ejs", {
                error: "Cannot create category or subcategory", categories: categories, subcategories: subcategories
                , success: null, oldData: req.body

            });
        }


    } else if (req.body.category && !req.body.subcategory) {
        try {
            console.log(req.body.newCategory);
            console.log(req.body.newSubcategory);

            // const newCategory = await catgoty.create(req.body.newCategory)

            const newSubcategory = await subcatgoty.create({ name: req.body.newSubcategory, category: req.body.category })

            req.body.subcategory = newSubcategory._id

            console.log("second conditaion  " + req.body.newSubcategory);

        } catch (error) {
            const { categories, subcategories } = await findAllCategories();
            console.log(" this error in second conditaion " + error);
            return res.render("employee/createProducts.ejs", {
                error: "Cannot create category or subcategory",
                categories: categories, subcategories: subcategories
                , success: null,
                oldData: req.body
            });
        }
        // this conditaions no way happens 
    } else if (!req.body.category && req.body.subcategory) {
        return res.status(400).send("Invalid data");
    }



    console.log(req.session.user._id)
    req.body.createdBy = req.session.user._id;

    console.log(req.body)

    // const product = {
    //     name: req.body.name,

    //     variants: req.body.variants
    // };
    //    save image in variants `  
    req.files.forEach(file => {
        const match = file.fieldname.match(/^variants\[(\d+)\]\[image\]$/);
        if (match) {
            const variantIndex = Number(match[1]);
            req.body.variants[variantIndex].image = file.filename;
        }
    });
    console.log("----------------------------------------------------------------------");

    console.log(req.body);


    console.log("----------------------------------------------------------------------");



    const { categories, subcategories } = await findAllCategories()

    try {

        const existingProduct = await Products.findOne({
            name: req.body.name
        });

        if (existingProduct) {
            return res.render("employee/createProducts.ejs", {
                categories,
                subcategories,
                success: null,
                error: "A product with this name already exists.",
                oldData: req.body
            });
        }

        const addProduct = await Products.create(req.body);

        return res.render("employee/createProducts.ejs", {
            categories,
            subcategories,
            success: "Product created successfully.",
            error: null
        });

    } catch (error) {
        console.log(error);

        return res.render("employee/createProducts.ejs", {
            categories,
            subcategories,
            success: null,
            error: "Failed to create product.",
            oldData: req.body
        });
    }


})



router.get('/veiws', async (req, res) => {
     const { categories, subcategories } = await findAllCategories();
    const limit = 10;
    const page = Number(req.query.page) || 1 ;

    const skip = (page - 1) * limit;

    const findallProducts = await Products.find().skip(skip).limit(limit).populate({
            path:"subcategory",
            populate:{
                path:"category"
            }
        });
    const totalProducts = await Products.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit); //  if i have 4.1  will be 5  is reverse floor

    res.render('employee/productsViews.ejs', { Products: findallProducts  , totalPages:totalPages , page:page ,totalProducts:totalProducts })
})



module.exports = router;