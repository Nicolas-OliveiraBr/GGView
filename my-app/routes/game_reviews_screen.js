var express = require('express');
var router = express.Router();
const igdbGames = require('../services/igdbGames'); 

router.get('/', function(req, res, next) {
  res.render('games', {
    title: `Games`,
    exclusiveCSS: 'games.css' // Renderizando um arquivo CSS específico para essa página
  })
});

router.get('/:name', async function(req, res, next) {
  try {
    const nameGame = req.params.name;

    const dadosDoJogo = await igdbGames.buscarPorNome(nameGame); 

    if (!dadosDoJogo) {
      return res.status(404).render('error', { 
        message: 'Jogo não encontrado', 
        error: { status: 404, stack: '' } 
      });
    }

    res.render('games', { 
      title: dadosDoJogo.nameGame,
      jogo: dadosDoJogo,
      exclusiveCSS: 'games.css'
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Erro ao carregar jogo', error });
  }
});

module.exports = router;