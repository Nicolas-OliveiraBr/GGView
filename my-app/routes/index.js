var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const fakeReviews = [
      { authorName: 'Nicolas', nameGame: 'The Witcher 3', year: 2015, rating: 5, gameCover: '/images/imgcarousel.jpg' },
      { authorName: 'Lucas', nameGame: 'Elden Ring', year: 2022, rating: 4, gameCover: '/images/imgcarousel2.jpg' },
      { authorName: 'Nicolas', nameGame: 'The Witcher 2', year: 2010, rating: 5, gameCover: '/images/imgcarousel.jpg' },
    ];

  res.render('index', { 
    title: 'Home',
    exclusiveCSS: 'home.css',
    fakeReviews: fakeReviews
  });
});

module.exports = router;
