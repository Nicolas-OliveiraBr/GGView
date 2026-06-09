var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('profile', {
    title: `Profile`,
    exclusiveCSS: 'profile.css' 
  }) 
})

router.get('/:username', function(req, res) {
    const fakeReviews = [
      { author: 'Nicolas', nameGame: 'The Witcher 3', year: 2015, rating: 5, gameCover: '/images/imgcarousel.jpg' },
      { author: 'Lucas', nameGame: 'Elden Ring', year: 2022, rating: 4, gameCover: '/images/imgcarousel2.jpg' },
      { author: 'Nicolas', nameGame: 'The Witcher 2', year: 2010, rating: 5, gameCover: '/images/imgcarousel.jpg' },
    ];
    const authorDescription = "Gamer and reviewer";

    var user = req.params.username;

    const userReviews = fakeReviews.filter(review => review.author === user);

    res.render('profile', {
        title: `Perfil de ${user}`,
        authorName: user,
        exclusiveCSS: 'profile.css',
        fakeReviews: userReviews,
        authorDescription: authorDescription
    });
});

module.exports = router;