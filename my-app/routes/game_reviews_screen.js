var express = require('express');
var router = express.Router();
const igdbGames = require('../services/igdbGames'); 

router.get('/', function(req, res, next) {
  res.render('games', {
    title: `Games`,
    exclusiveCSS: 'games.css' // Renderizando um arquivo CSS específico para essa página
  })
});

router.get('/:name', function(req, res, next) {
  try{
  const game_name = req.params.name
  const gameID = req.params.id

    res.render('games', { 
      title: dadosDoJogo.nameGame,
      jogo: dadosDoJogo,
      exclusiveCSS: 'games.css'
    });
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    res.status(404).render('error', { message: 'Jogo não encontrado' });
  }
});

module.exports = router;