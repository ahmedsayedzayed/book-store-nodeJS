const Product = require('../models/product.model')
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle : 'Add Product',
        path: '/admin/add-product', // for active class on toolbar
       editing:false,
    });
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // Create Product After Add Relations
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
    }).then((result) => {
        // console.log(result);
        console.log('Product Added successfully');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
    // Create Product Manuallly
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     userId: req.user.id
    // }).then((result) => {
    //     // console.log(result);
    //     console.log('Product Added successfully');
    //     res.redirect('/admin/products');
    // }).catch(err => {
    //     console.log(err);
    // });
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) { 
        return res.redirect('/');
    };
    const prodId = req.params.productId;
    // Product.findById(prodId) // By Product Model Get all products
        req.user.getProducts({where: {id: prodId}}) // By User Model Get all products for This User
        .then(
            (products) => {
                // console.log(product);
                const product = products[0];
            if (!product) { console.log('ahmed'); return res.redirect('/') };
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product', // for active class on toolbar
                editing: editMode,
                product: product
            });
        }
    )
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.id;
    // const product = new Product(req.body.id, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    Product.findById(prodId)
        .then(product => { 
        product.title = req.body.title;
        product.price = req.body.price;
        product.imageUrl = req.body.imageUrl;
        product.description = req.body.description;
        return product.save();
        })
        .then(result => {  res.redirect('/admin/products');console.log('Product Updated successfully')}
    )
    .catch(err => console.log(err));
  
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.destroy({where: {id: prodId}});
    Product.findById(prodId)
        .then((product) => { 
            return product.destroy();
        }).then(result => { 
            console.log('Product Deleted successfully');
            res.redirect('/admin/products');
        })
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getProducts = (req, res, next) => {
    // Product.fetchAll((products) => {
    //     res.render('admin/products', {
    //         prods: products,
    //         pageTitle : 'Admin Products',
    //         path: '/admin/products',
    //     });
    // });

    // Product.findAll() // With product Model Get all products
        req.user.getProducts() // With User Model Get all products for This User
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(err => console.log(err));
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------