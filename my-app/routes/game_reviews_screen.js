var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: `Games` })
})
router.get('/:name', function(req, res, next) {
    var game_name = req.params.name
    res.render('index', { title: `${game_name}`})
});

module.exports = router;