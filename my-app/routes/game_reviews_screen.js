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
  try {
    const gameID = req.params.id
    const response = await igdbGames.buscarPorId(gameID);
  
    const gameData = response[0];
    console.log(gameData);
  
    if (!gameData) {
      return res.status(404).render('error', { message: 'Jogo não encontrado' });
    }
  
      res.render('games', { 
        title: gameData.name,
        exclusiveCSS: 'games.css',
        game: gameData
    })
  } catch(error) {
    console.error("Erro ao buscar jogo:", error);
    next(error);
  }
});

module.exports = router;