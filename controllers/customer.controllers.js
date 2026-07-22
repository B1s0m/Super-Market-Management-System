const router = require("express").Router()

const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Cart = require("../models/Cart");








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


router.post("/cart/add", async (req, res) => {
    try {
        const productId = req.body.productId;
        const variantIndex = Number(req.body.variantIndex);
        const quantity = Number(req.body.quantity);

        // Change this depending on how you store the logged-in user
        const userId = req.session.user?._id;

        if (!userId) {
            return res.status(401).send("You must log in first");
        }

        if (
            !productId ||
            !Number.isInteger(variantIndex) ||
            variantIndex < 0 ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).send("Invalid cart information");
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        const selectedVariant = product.variants[variantIndex];

        if (!selectedVariant) {
            return res.status(400).send("Invalid product variant");
        }

        const variantStock = Number(selectedVariant.quantity);
        const variantPrice = Number(selectedVariant.price);

        if (!Number.isFinite(variantPrice)) {
            return res.status(400).send("Invalid product price");
        }

        if (quantity > variantStock) {
            return res.status(400).send("Not enough stock");
        }

        let cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0
            });
        }

        const existingItem = cart.items.find(item => {
            return (
                item.product.toString() === productId &&
                Number(item.variantIndex) === variantIndex
            );
        });

        if (existingItem) {
            const newQuantity =
                Number(existingItem.quantity) + quantity;

            if (newQuantity > variantStock) {
                return res.status(400).send(
                    `Only ${variantStock} items are available`
                );
            }

            existingItem.quantity = newQuantity;
            existingItem.priceAtAdd = variantPrice;
        } else {
            cart.items.push({
                product: productId,
                variantIndex: variantIndex,
                quantity: quantity,
                priceAtAdd: variantPrice
            });
        }

        /*
          Fix old cart items created before variantIndex
          or priceAtAdd were added to the schema.
        */
        const validItems = [];

        for (const item of cart.items) {
            const itemProduct = await Product.findById(item.product);

            if (!itemProduct) {
                continue;
            }

            const itemVariantIndex = Number(item.variantIndex);
            const itemVariant =
                itemProduct.variants[itemVariantIndex];

            if (!itemVariant) {
                continue;
            }

            const itemPrice = Number(itemVariant.price);
            const itemQuantity = Number(item.quantity);

            if (
                !Number.isFinite(itemPrice) ||
                !Number.isInteger(itemQuantity) ||
                itemQuantity < 1
            ) {
                continue;
            }

            item.priceAtAdd = itemPrice;
            validItems.push(item);
        }

        cart.items = validItems;

        cart.totalPrice = cart.items.reduce((total, item) => {
            const price = Number(item.priceAtAdd);
            const itemQuantity = Number(item.quantity);

            return total + price * itemQuantity;
        }, 0);

        await cart.save();

        return res.redirect("/cart");

    } catch (error) {
        console.log("Error adding product to cart:", error);

        return res
            .status(500)
            .send("Failed to add product to cart");
    }
});



router.get("/cart", async (req, res) => {
    try {
        const userId = req.session.user?._id;

        if (!userId) {
            return res.redirect("/auth/sign-in");
        }

        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product");

        res.render("customer/cart.ejs", {
            cart
        });

    } catch (error) {
        console.log("Error loading cart:", error);

        res.status(500).send("Failed to load cart");
    }
});


module.exports = router;