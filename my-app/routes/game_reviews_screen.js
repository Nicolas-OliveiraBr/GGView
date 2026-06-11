var express = require('express');
var router = express.Router();
const igdbGames = require('../services/igdbGames'); 

router.get('/:id', async function(req, res, next) {
  try {
    const gameId = req.params.id; 
    
    const dadosDoJogo = await igdbGames.buscarPorId(gameId); 

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