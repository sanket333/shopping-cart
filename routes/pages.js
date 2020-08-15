var express = require('express');
const Product = require('../models/product');
var router = express.Router();
router.get('/',function(req,res){
    Product.find({})
        .then(product => {
            res.render('index',{Product : product})  
        })
        .catch(err => {
            console.log(err);
        })
})

var cart = [];

router.post('/add-to-cart',(req,res) => {
    var item = req.body.title;
    cart.push(item);
    console.log(item);
    res.render('cart',{List : cart});
})
module.exports = router;