const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    title : {
        type : String,
        required : true
    },
    slug : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
     },
     image : {
         type : String,
         required : true
     },
    description : {
        type : String
    }
})

module.exports = mongoose.model('product',Product)