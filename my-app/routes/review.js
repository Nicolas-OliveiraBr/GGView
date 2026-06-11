var express = require('express');
var router = express.Router();

// salvar a review que vem do formulário do modal de review
router.post('/create', async(req, res) => {
    try {
        const { gameRef, descricao, avaliacao, userRef } = req.body;
        
        const newReview = await Review.create({
            gameId: gameRef,
            reviewText: descricao,
            rating: Number(avaliacao),
            authorName: userRef || "Usuário",
            createdAt: new Date()
        });
        
        res.status(201).json({ message: "Review criada com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar no servidor." });
    }
});

module.exports = router;