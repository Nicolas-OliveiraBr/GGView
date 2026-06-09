var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('games', {
    title: `Profile`,
    exclusiveCSS: 'profile.css' 
  }) 
})

router.get('/profile/:username', function(req, res) {
    var user = req.params.username;
    res.render('profile', { name: user }); // Renderiza a sua tela de perfil
});

module.exports = router;