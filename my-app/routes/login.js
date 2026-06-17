const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login', { 
        title: 'Login',
        exclusiveCSS: 'login'
    });
});

module.exports = router;