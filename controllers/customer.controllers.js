const router = require("express").Router()

const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Cart = require("../models/Cart");
const Order = require("../models/Order");








router.get('/homepage', async (req, res) => {
    const countCatgoty = await Category.find()
    // gt mean greate than      sort large → small
    const offers = await Product.find({ discount: { $gt: 0 } }).sort({ discount: -1 }).limit(8)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        });
    // console.log(offers);
    //   console.log("----------------------------featuredProducts---------------");
    const featuredProducts = await Product.find().sort({ views: -1 }).limit(8)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        });

    // console.log(featuredProducts);
    console.log("----------------------------newArrivals---------------");
    const newArrivals = await Product.find()
        .sort({ createdAt: -1 }).limit(8)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        });

    
    res.render('customer/customerHome.ejs', { offers, newArrivals, featuredProducts, countCatgoty })
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

        // console.log(products);

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




router.post("/cart/update/:itemId", async (req, res) => {
    try {
        const userId = req.session.user._id;
        const itemId = req.params.itemId;
        const newQuantity = Number(req.body.quantity);
     
        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            return res.status(400).send("Invalid quantity");
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        const item = cart.items.id(itemId);

        if (!item) {
            return res.status(404).send("Cart item not found");
        }

        const product = await Product.findById(item.product);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        const variant = product.variants[item.variantIndex];

        if (!variant) {
            return res.status(404).send("Variant not found");
        }

        if (newQuantity > variant.quantity) {
            return res.status(400).send(`Only ${variant.quantity} items available`);
        }

        // Update quantity
        item.quantity = newQuantity;

        // Update price in case it changed
        item.priceAtAdd = variant.price;

        // Recalculate cart total
        cart.totalPrice = cart.items.reduce((total, cartItem) => {
            return total + (cartItem.priceAtAdd * cartItem.quantity);
        }, 0);

        await cart.save();

        res.redirect("/cart");

    } catch (error) {
        console.log("Error updating cart:", error);
        res.status(500).send("Failed to update cart");
    }
});



router.post("/cart/remove/:itemId", async (req, res) => {
    try {
        const userId = req.session.user._id;
        const itemId = req.params.itemId;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        // Find the item in the cart
        const item = cart.items.id(itemId);

        if (!item) {
            return res.status(404).send("Cart item not found");
        }

        // Remove the item
        item.deleteOne();

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, cartItem) => {
            return total + (cartItem.priceAtAdd * cartItem.quantity);
        }, 0);

        await cart.save();

        res.redirect("/cart");

    } catch (error) {
        console.log("Error removing cart item:", error);
        res.status(500).send("Failed to remove cart item");
    }
});



router.post("/checkout", async (req, res) => {
    try {

        const userId = req.session.user._id;

        // Find user's cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).send("Your cart is empty.");
        }

        const orderItems = [];
        let totalPrice = 0;

        // Check stock first
        for (const item of cart.items) {

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).send("Product not found.");
            }

            const variant = product.variants[item.variantIndex];

            if (!variant) {
                return res.status(400).send("Product variant not found.");
            }

            if (variant.quantity < item.quantity) {
                return res.status(400).send(
                    `${product.name} has only ${variant.quantity} item(s) left in stock.`
                );
            }
        }

        // Everything is valid, create order
        for (const item of cart.items) {

            const product = await Product.findById(item.product);

            const variant = product.variants[item.variantIndex];

            // Reduce stock
            variant.quantity -= item.quantity;

            await product.save();

            orderItems.push({
                product: product._id,
                variantIndex: item.variantIndex,
                quantity: item.quantity,
                price: item.priceAtAdd
            });

            totalPrice += item.priceAtAdd * item.quantity;
        }

        // Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalPrice: totalPrice
        });

        // Delete cart
        await Cart.deleteOne({ _id: cart._id });

        res.redirect(`/orders/${order._id}`);

    } catch (error) {

        console.log("Checkout Error:", error);

        res.status(500).send("Checkout failed.");
    }
});

router.get("/orders", async (req, res) => {
    try {
        const userId = req.session.user?._id;

        if (!userId) {
            return res.redirect("/auth/sign-in");
        }

        const orders = await Order.find({
            user: userId
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.render("customer/orders.ejs", {
            orders
        });

    } catch (error) {
        console.log("Error loading orders:", error);

        return res
            .status(500)
            .send("Failed to load orders");
    }
});

router.get("/offers", async (req, res) => {
    try {

        // const limit = 10;
        // const page = Number(req.query.page) || 1;

        // const skip = (page - 1) * limit;

        const products = await Product.find({
            discount: { $gt: 0 }
        }).populate("subcategory")
        .sort({ discount: -1 });
             
        res.render("customer/productsList.ejs", {
            title: "Offers",
            products
        });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});
router.get("/featured", async (req, res) => {
    try {
        const products = await Product.find().limit(20)
            .populate("subcategory")
            .sort({ views: -1 });

        res.render("customer/productsList.ejs", {
            title: "Featured Products",
            products
        });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});
router.get("/new-arrivals", async (req, res) => {
    try {
        const products = await Product.find().limit(20)
            .populate("subcategory")
            .sort({ createdAt: -1 });

        res.render("customer/productsList.ejs", {
            title: "New Arrivals",
            products
        });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

module.exports = router;