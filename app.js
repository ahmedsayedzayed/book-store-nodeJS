// import express;
const express = require('express');
// import Sequelize;
const sequelize = require('./util/database');
// Import  Body Parser Middleware
const bodyParser = require('body-parser');    
// Import  path module
const path = require('path')  
// Import Admin Routes
const adminRoutes = require('./routes/admin.routes');
// Import Shop Routes
const shopRoutes = require('./routes/shop.routes');
// Import Error Routes
const errorController = require('./controllers/error.controller')
// Imported Models
const Product = require('./models/product.model');
const User = require('./models/user.model');
const Cart = require('./models/cart.model');
const CartItem = require('./models/cart-item.model');
const Order = require('./models/order.model');
const OrderItem = require('./models/order-item.model');
//------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initialize the app
const app = express();;
// add eJs as templating enging
app.set('view engine', 'ejs');
// define the views file and its ./views by default
app.set('views', 'views')
// Define the Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// Define the path to the public folder
app.use(express.static(path.join(__dirname, 'public')));
// Return User  Middleware To User User Model In Request 
app.use((req, res, next) => { 
    User.findById(1)
        .then(user => { 
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});
// Routes Middlewares
app.use('/admin',adminRoutes);
app.use(shopRoutes);
// should be the last Route Handling one as it not existing routes (Error 404)
app.use(errorController.get404);
//------------------------------------------------------------------------------------------------------------------------------------------------------------
// Define Relationships
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
//------------------------------------------------------------------------------------------------------------------------------------------------------------
// Sync the database
// sequelize.sync({force:true})    /// When you run this code, it will drop the table and recreate it.
sequelize.sync()
    .then(() => { return User.findById(1); })
    // Create Dummy user if Not Exist
    .then(user => { 
        if (!user) { return User.create({ name: 'Ahmed', email: 'test@test.com' }); }
        // return Promise.resolve(user); // return the user as a promise to the next then
        return user;
    })
    // Create Cart For The dummy user
    .then(user => { 
        return user.createCart()
    })
    // Listen to the port after creating cart
    .then(cart => { 
        app.listen(3000);
    })
    .catch(err => { 
        console.log(err);
    })
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------