const Product = require('../models/product.model');
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => { 
        res.render('shop/products-list', {
            prods: products,
            docTitle: 'All Products',
            path: '/products',
        });
    });       
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            docTitle: 'Shop',
            path: '/',
        });
    });
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        docTitle: 'Your Cart',
        path:'/cart'
    })
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path:'/checkout'
    })
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
