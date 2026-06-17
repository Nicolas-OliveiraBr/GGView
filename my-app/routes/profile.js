var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('profile', {
    title: 'Profile',
    exclusiveCSS: 'profile.css'
  }) 
})

router.get('/:username', function(req, res) {
    const fakeReviews = [
      { authorName: 'Nicolas', nameGame: 'The Witcher 3', year: 2015, rating: 5, gameCover: '/images/imgcarousel.jpg', reviewText: "Jogo muito bom!!"},
      { authorName: 'Lucas', nameGame: 'Elden Ring', year: 2022, rating: 4, gameCover: '/images/imgcarousel2.jpg', reviewText: "Jogo MUITOOOOOOOO bom!!" },
      { authorName: 'Lucas', nameGame: 'Minecraft', year: 2009, rating: 5, gameCover: '/images/imgcarousel2.jpg', reviewText: "dá pro gastoo" },
      { authorName: 'Nicolas', nameGame: 'The Witcher 2', year: 2010, rating: 2, gameCover: '/images/imgcarousel.jpg', reviewText: "Vale a pena não jogar viu" },
      { authorName: 'Jorge', nameGame: 'Elden Ring', year: 2022, rating: 5, gameCover: '/images/imgcarousel2.jpg', reviewText: "Amei, recomendei pra todo mundo." },
    ]; 
    const authorDescription = "Gamer and reviewer";

    var user = req.params.username;

    const userReviews = fakeReviews.filter(review => review.authorName === user);
    const sortedReviews = userReviews.sort((a, b) => { // ordenar reviews mais recentes
        return new Date(b.year) - new Date(a.year);
    });

    res.render('profile', {
        title: `Perfil de ${user}`,
        authorName: user,
        exclusiveCSS: 'profile',
        fakeReviews: sortedReviews,
        authorDescription: authorDescription
    });
});

module.exports = router;