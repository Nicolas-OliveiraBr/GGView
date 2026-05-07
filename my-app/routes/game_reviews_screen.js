var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('games', { title: `Games` })
})
router.get('/:name', function(req, res, next) {
    var game_name = req.params.name
    res.render('games', { title: `${game_name}`})
});

module.exports = router;