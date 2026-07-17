
//     const addvalue= await catgoty.insertMany([
//   {
//     name: "Electronics"
//   },
//   {
//     name: "Food"
//   },
//   {
//     name: "Books"
//   },
//   {
//     name: "Drinks"
//   },
//   {
//     name: "Clothing"
//   }
// ]);

const electronics = await catgoty.findOne({
    name:"Electronics"
});

const food = await catgoty.findOne({
    name:"Food"
});

const books = await catgoty.findOne({
    name:"Books"
});

const drinks = await catgoty.findOne({
    name:"Drinks"
});

const clothing = await catgoty.findOne({
    name:"Clothing"
});
 
const addsubqaury=await subcatgoty.insertMany([

{
    name:"Mobile Phones",
    category: electronics._id
},

{
    name:"Laptops",
    category: electronics._id
},

{
    name:"Gaming",
    category: electronics._id
},


{
    name:"Fruits",
    category: food._id
},

{
    name:"Vegetables",
    category: food._id
},

{
    name:"Dairy",
    category: food._id
},


{
    name:"Programming",
    category: books._id
},

{
    name:"Novel",
    category: books._id
},


{
    name:"Soft Drinks",
    category: drinks._id
},

{
    name:"Juice",
    category: drinks._id
},

{
    name:"Water",
    category: drinks._id
},


{
    name:"Men Clothing",
    category: clothing._id
},

{
    name:"Women Clothing",
    category: clothing._id
},

{
    name:"Shoes",
    category: clothing._id
}

]);

