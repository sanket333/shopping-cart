const express = require('express');
const { model } = require('../models/page');
const router = express.Router();

router.get('/',(req,res) => {
    res.render('admin/admin_dashboard.ejs');
})

module.exports = router;