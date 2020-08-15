const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const bodyParser = require('body-parser');
const { body } = require('express-validator/check');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

router.get('/',(req,res) => {
    Category.find({}).exec((err,Categories) => {
        res.render('admin/categories',{Categories : Categories});
    })
    
})

router.get('/add-category',(req,res) => {
    var title = '';
    var slug = '';
    res.render('admin/add_category',{title : req.body.title,slug : req.body.slug});
})

router.post('/add-category',(req,res) => {
    req.checkBody('title','title must have a value').notEmpty();
    req.checkBody('slug','slug should have some value').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug;
    if(slug == "") slug = title;
    var errors = req.validationErrors();
    if(errors){
        res.render('admin/add_category',{errors : errors,title : title,slug : slug})
    }
    else{
        Category.findOne({title : title},(err,categories) => {
            if(categories){
                req.flash('danger','choose an other title');
                res.render('admin/add_category',{title : title,slug : slug});
            }
            else{
                Category.create({title : title,slug :slug})
                .then(item => {
                    req.flash('success','category added successfully.');
                    res.redirect('/admin/categories')
                })
                .catch(err => {
                    console.log(err);
                })
            }
            
        })
    }
})

router.get('/edit-category/:title',(req,res) => {
    Category.findOne({title : req.params.title},function(err,item){
        if(err) return console.log(err);
        var title = item.title;
        var slug = item.slug;
        var id = item._id;
        console.log(item)
        res.render('admin/edit_category',{title : title,slug : slug,id : id})
    })
})

router.post('/edit-category/:Title',(req,res) => {
    req.checkBody('title','title must have a value').notEmpty();
    req.checkBody('slug','slug should have some value').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug;
    console.log(req.body.id);
    var id = req.body.id;
    if(slug == "") slug = title;
    var errors = req.validationErrors();
    if(errors){
        
        res.render('admin/edit_category',{errors : errors,title : title,slug : slug})
    }
    
    else{
        
        Category.findOne({title : req.params.Title},function(err,categories){
            if(categories){
                console.log(categories);
                req.flash('danger','choose an other title');
                res.render('admin/edit_category',{title : title,slug : slug,id : id});
            }
            else{
                console.log(req.params.Title)
                Category.findById(id,function(err,result){
                    if(err)return console.log(err);
                    console.log(result);
                    result.title = title;
                    result.slug = slug;
                    result.save(err => {
                        if(err) return console.log(err);
                        req.flash('success','category updated');
                        res.redirect('/admin/categories');
                    })
                    
                })
                
            }
            
        })
    }
})

router.delete('/delete-category/:title',(req,res) => {
    console.log('inside router');
    Category.findOneAndDelete({title : req.params.title},(err,result) => {
        if(err) return console.log(err);
        console.log(result);
        req.flash('danger','category successfully deleted.');
        res.redirect('/admin/categories');
    })
})




module.exports = router;