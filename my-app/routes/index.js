var express = require('express');
var router = express.Router();
const igdbGames = require('../services/igdbGames')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const popularGames = await igdbGames.buscarPopulares();
  const toBeReleased = await igdbGames.bucarLançamentos();

  const fakeReviews = [
      { authorName: 'Nicolas', nameGame: 'The Witcher 3', year: 2015, rating: 5, gameCover: '/images/imgcarousel.jpg' },
      { authorName: 'Lucas', nameGame: 'Elden Ring', year: 2022, rating: 4, gameCover: '/images/imgcarousel2.jpg' },
      { authorName: 'Nicolas', nameGame: 'The Witcher 2', year: 2010, rating: 5, gameCover: '/images/imgcarousel.jpg' },
    ];

  res.render('index', { 
    title: 'Home',
    exclusiveCSS: 'home',
    fakeReviews: fakeReviews,
    dadosDosJogos: popularGames,
    lancamentos: toBeReleased
  });
});

module.exports = router;
