var express = require('express');
var router = express.Router();
const igdbGames = require('../services/igdbGames')

router.get('/', function(req, res, next) {
  res.render('games', {
    title: `Games`,
    exclusiveCSS: 'games.css' // Renderizando um arquivo CSS específico para essa página
  })
});

router.get('/:id', async function(req, res, next) {
  const gameID = req.params.id

    res.render('games', { 
      title: `${game_name}`,
      exclusiveCSS: 'games.css'
  })
});

module.exports = router;