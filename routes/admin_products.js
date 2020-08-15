const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imgs');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({ storage: storage });


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.use(methodOverride('_method'));

router.get('/', (req, res) => {
    Product.find({}).exec((err, items) => {
        if (err) return console.log(err);
        res.render('admin/products', { Product: items })
    })
})

router.get('/add-product', (req, res) => {
    var title = "";
    var slug = "";
    var category = "";
    var description = "";
    var image = "";
    res.render('admin/add_product', { title: title, slug: slug, category: category, description: description, image: image })
})

router.post('/add-product', upload.single('image'), (req, res) => {
    req.checkBody('title', 'please enter a title').notEmpty();
    req.checkBody('slug', 'please enter a slug').notEmpty();
    req.checkBody('category', 'please enter a category').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug;
    var category = req.body.category;
    var description = req.body.description;
    if (!req.file) {
        req.flash('danger', 'upaload an image');
        res.render('admin/add_product', { title: title, slug: slug, category: category, description: description, image: image })
    }
    else {
        var image = req.file.path;

        var errors = req.validationErrors();
        if (errors) {
            res.render('admin/add_product', { errors: errors, title: title, slug: slug, category: category, description: description, image: image })
        }
        else {
            Product.findOne({ title: title })
                .then((product) => {
                    if (product) {
                        req.flash('danger', 'title can not be same');
                        res.render('admin/add_product', { title: title, slug: slug, category: category, description: description, image: image })
                    }
                    else {
                        Category.findOne({ title: category }, (err, item) => {
                            if (!item) {
                                req.flash('danger', 'this category is not a vaild one');
                                res.render('admin/add_product', { title: title, slug: slug, category: category, description: description, image: image })
                            }
                            else {
                                Product.create({
                                    title: title,
                                    slug: slug,
                                    category: category,
                                    description: description,
                                    image: image
                                })
                                    .then((item) => {
                                        req.flash('success', 'successfully saved.')
                                        res.redirect('/admin/products')
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            }
                        })
                    }

                })
                .catch(err => {
                    console.log(err);
                })

        }
    }

})

router.get('/edit-product/:title', (req, res) => {
    Product.findOne({ title: req.params.title }, function (err, item) {
        if (err) return console.log(err);
        var title = item.title;
        var slug = item.slug;
        var id = item._id;
        var category = item.category;
        var description = item.description;
        var image = item.image;
        console.log('get '+title);
        res.render('admin/edit_product', { title: title, slug: slug, id: id ,category : category,description:description});
    })
})

router.post('/edit-product/:title',(req,res) => {
    // req.checkBody('title', 'please enter a title').notEmpty();
    // req.check(slug, 'please enter a slug').notEmpty();
    // req.check(category, 'please enter a category').notEmpty();
            
    var title = req.body.title || "empty";
    var slug = req.body.slug;
    var category = req.body.category;
    var description = req.body.description;
    var id = req.body.id;
    if(!title){
        req.flash('danger','title can not be empty')
        res.render('admin/edit_product', { id : id,errors: errors, title: title, slug: slug, category: category, description: description})
        return;
        console.log('after break')
    }  

    
        
    console.log('post1 '+title);
        var errors = req.validationErrors();
        if (errors) {
            console.log('post2 '+title);
            res.render('admin/edit_product', { id : id,errors: errors, title: title, slug: slug, category: category, description: description})
        }
        else {
            console.log('else '+title);
            Product.findOne({ title: title })
                .then((product) => {
                    if (product) {
                        req.flash('danger', 'title can not be same');
                        res.render('admin/edit_product', { id:id,title: title, slug: slug, category: category, description: description})
                    }
                    else {
                        Category.findOne({ title: category }, (err, item) => {
                            if (!item) {
                                req.flash('danger', 'this category is not a vaild one');
                                res.render('admin/edit_product', { id:id,title: title, slug: slug, category: category, description: description})
                            }
                            else {
                                Product.findByIdAndUpdate(id,{title: title, slug: slug, category: category, description: description})
                                    .then((item) => {
                                        req.flash('success', 'successfully saved.')
                                        res.redirect('/admin/products')
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            }
                        })
                    }

                })
                .catch(err => {
                    console.log(err);
                })

        }
    
})

router.delete('/delete-product/:title',(req,res) =>{
    Product.findOneAndDelete({title : req.params.title})
    .then((item) => {
        req.flash('success','product successfully deleted.');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    })
})

module.exports = router;