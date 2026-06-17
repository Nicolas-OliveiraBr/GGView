var express = require('express');
var router = express.Router();
const igdbGames = require('../services/igdbGames');
const fetch = require('node-fetch');

// Função que faz a tradução da descrição do jogo
async function translator(msg) {
  if (!msg) return 'Nenhuma descrição disponível para este jogo.';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(msg)}`;
  const apiTranslator = await fetch(url);
  // console.log(apiTranslator);
  const data = await apiTranslator.json();
  
  
    // Resposta do Google Tradutor é uma string de arrays, que precisa ser convertida para aparecer sem uma estrutura de um JSON 
    if (Array.isArray(data) && data[0]) {
      const translation = data[0].map(sentence => sentence[0]).join('');
      return translation;
    }
  // console.log(translation);
  return msg
}


router.get('/:id', async function(req, res, next) {
  try {
    const fakeReviews = [
      { authorName: 'Nicolas', rating: 5},
      { authorName: 'Lucas', rating: 4},
      { authorName: 'Nicolas', rating: 5},
      { authorName: 'Nicolas', rating: 5},
      { authorName: 'Nicolas', rating: 5},
      { authorName: 'Nicolas', rating: 5},
    ];
    const gameID = req.params.id
    const response = await igdbGames.buscarPorId(gameID);
    const gameData = response[0];
    const gameDescription = gameData.summary;
    console.log(gameData);

    const gameDescTranslation = await translator(gameDescription);
    console.log(gameDescTranslation)
  
    if (!gameData) {
      return res.status(404).render('error', { message: 'Jogo não encontrado' });
    }
  
      res.render('games', { 
        title: gameData.name,
        exclusiveCSS: 'games.css',
        game: gameData,
        fakeReviews: fakeReviews,
        gameDesc: gameDescTranslation
    })
  } catch(error) {
    console.error("Erro ao buscar jogo:", error);
    next(error);
  }
});

module.exports = router;