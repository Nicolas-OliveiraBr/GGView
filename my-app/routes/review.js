var express = require('express');
var router = express.Router();

// salvar a review que vem do formulário do modal de review
router.post('/create', async(req, res) => {
    try {
    const { nameGame, reviewText, rating, authorName } = req.body;
    
     const newReview = await Review.create({
            gameId,
            nameGame,
            reviewText,
            rating: Number(rating),
            isFavorite: isFavorite === 'true', // Converte string para booleano
            authorName: authorName || "Usuário",
            createdAt: new Date()
    });
    
    res.status(201).json({ message: "Review criada com sucesso!" });

    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar no servidor." });
    }
});

module.exports = router;