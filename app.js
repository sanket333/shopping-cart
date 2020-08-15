var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
const expressValidator = require('express-validator');
//connect the mongodb database
mongoose.connect(config.database, {useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify : false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connecttion to MongoDB successful!');
});

var app = express();

//body parser middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());
//express-session middleware

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
 // cookie: { secure: true }
}))
//express-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//using express-validator to check value get from form.
app.use(expressValidator());
//set up the view section
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
//set up public folder
app.use(express.static(path.join(__dirname,'/')));
//set global errors variables
app.locals.errors = null;
//set up routes
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategory = require('./routes/admin_categories.js')
var adminProduct = require('./routes/admin_products');
var admin = require('./routes/admin');
app.use('/',pages);
app.use('/admin',admin);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategory)
app.use('/admin/products',adminProduct)
var port = 3003
app.listen(port, ()=>{
    console.log(`The server is running at ${port}`)
})
