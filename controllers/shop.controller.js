const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getProducts = (req, res, next) => {
     // SQL query by mysql2
        // Product.fetchAll()
        //     .then(([rows, fieldData]) => {
        //         res.render('shop/product-list', {
        //             prods: rows,
        //             pageTitle: 'All Products',
        //             path: '/products',
        //         });
        //     })
        //     .catch(err => { console.log(err); });
    
        Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
            });
        })
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // from my sql2
    // Product.findById(prodId)
    //     .then(([product]) => { 
    //         res.render('shop/product-detail', {
    //             product: product[0],
    //             pageTitle: product.title,
    //             path: '/products' 
    //         });
    //     })
    //     .catch(err => console.log(res))    
// from sequlize 
    // Product.findAll({ where: { id: prodId } })
    //     .then(products => {
    //         res.render('shop/product-detail', {
    //             product: products[0],
    //             pageTitle: products[0].title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log(err));
    Product.findById(prodId)
        .then((product) => { 
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products' 
            });
        })
        .catch(err => console.log(res))    
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getIndex = (req, res, next) => {
   // SQL query by mysql2
    //    Product.fetchAll()
    //         .then(([rows, fieldData]) => {
    //             res.render('shop/index', {
    //                 prods: rows,
    //                 pageTitle: 'Shop',
    //                 path: '/',
    //             });
    //         })
    //         .catch(err=> console.log(err))

     // SQL query by sequlize
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
            });
        })
   
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getCart = (req, res, next) => {
    // Get associated Cart for User
    req.user.getCart()
        .then(cart => { 
            // console.log(cart);
            // Get associated Products for Cart
            return cart.getProducts();
        })
        .then(products => { 
            console.log(products);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
    // not using sequelize
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for (product of products) { 
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cartProductData) { 
    //                 cartProducts.push({productData: product, qty: cartProductData.qty});
    //             }
    //         }
    //         console.log(cartProducts.length);
    //         res.render('shop/cart', {
    //             pageTitle: 'Your Cart',
    //             path: '/cart',
    //             products: cartProducts
    //         });
    //     });
    // });
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => { 
            fetchedCart = cart;
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => { 
            let product;
            if (products.length > 0) { 
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            } else { 
                return Product.findById(prodId)
            } 
        })
        .then(product => { 
            return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
        })
        .then(() => { 
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

    // not using sequelize
    // Product.findById(prodId, (product) => {
    //     Cart.addProduct(prodId, product.price);
    // });
    // res.redirect('/cart');
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    // sequelize

    req.user
        .getCart()
        .then(cart => { 
            return cart.getProducts({where: {id: productId}});
        })
        .then(products => { 
            const product = products[0];
            product.cartItem.destroy();
        })
        .then(result => { 
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

    // not using sequelize
    // Product.findById(productId, product => {
    //     Cart.deleteProduct(productId, product.price);
    //     res.redirect('/cart');
    // });
    
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => { 
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => { 
            req.user
                .createOrder()
                .then(order => { 
                    return order.addProducts(products.map(product => { 
                        product.orderItem = {
                            quantity: product.cartItem.quantity
                        };
                        return product
                    }))
                })
                .then(result => { 
                    return fetchedCart.setProducts(null)
                })
                .then(result => { 
                    res.redirect('/orders');
                })
                .catch(err=> console.log(err))
        })
        .catch(err=> console.log(err))
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']})
        .then(orders => { 
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err=> console.log(err))
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path:'/checkout'
    })
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------