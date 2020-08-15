const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category = new Schema({
    title : {
        type : String,
        require : true
    },
    slug : {
        type : String,
        require : true
    }
})

module.exports = mongoose.model('category',category);