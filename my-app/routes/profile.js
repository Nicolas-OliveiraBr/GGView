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
      { authorName: 'Nicolas', nameGame: 'The Witcher 3', year: 2015, rating: 5, gameCover: '/images/imgcarousel.jpg' },
      { authorName: 'Lucas', nameGame: 'Elden Ring', year: 2022, rating: 4, gameCover: '/images/imgcarousel2.jpg' },
      { authorName: 'Nicolas', nameGame: 'The Witcher 2', year: 2010, rating: 5, gameCover: '/images/imgcarousel.jpg' },
    ]; 
    const authorDescription = "Gamer and reviewer";

    var user = req.params.username;

    const userReviews = fakeReviews.filter(review => review.author === user);
    const sortedReviews = userReviews.sort((a, b) => { // ordenar reviews mais recentes
        return new Date(b.reviewDate) - new Date(a.reviewDate);
    });
    res.render('profile', {
        title: `Perfil de ${user}`,
        authorName: user,
        exclusiveCSS: 'profile.css',
        fakeReviews: sortedReviews,
        authorDescription: authorDescription
    });
});

module.exports = router;