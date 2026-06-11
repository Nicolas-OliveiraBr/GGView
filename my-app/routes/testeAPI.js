var express = require('express');
var router = express.Router();
const igdbGames = require("../services/igdbGames");

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const games = await igdbGames.buscarPorId(45323);

        res.render('testeAPI', { title: 'Teste API' , games: games});

    } catch (error) {
        console.error("Error:", error);

        res.status(500).send("Erro ao buscar jogos");
    }
    
});

module.exports = router;
