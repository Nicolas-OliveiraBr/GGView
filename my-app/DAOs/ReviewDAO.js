const JogoDAO = require('./JogoDAO.js');

class ReviewDAO {
    static async criarReview(collectionReview, collectionJogo, review) {
        try {
            const [resInsertReview, resIdentfyReview] = await Promise.all([collectionReview.insertOne(review), JogoDAO.identifyNewReview(collectionJogo, review.gameRef, review.avaliacao)]);
            return {
                resInsertReview: resInsertReview,
                resIdentfyReview: resIdentfyReview
            };
        } catch (err) {
            console.error("Erro em ReviewDAO.criarReview: ", JSON.stringify(err, null, 2))

            // USUARIO JÁ CRIOU UMA REVIEW NO JOGO.
            // NÃO PODE-SE PERMITIR MAIS DE UMA AVALIAÇÃO EM UM JOGO
            if (err.code === 11000) {
                return {
                    status: 409, //erro de conflito
                    error: "Não se pode permitir mais de uma valiação em um jogo."
                }
            }

            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                return {
                    status: 503, //serviço insdisponível
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            return {
                status: 500, //erro genérico
                error: "Desculpe, ocorreu um erro interno no servidor."
            };
        }
    }

    static async editarReview(collection, userRef, gameRef, dados) {
        try {
            const result = await collection.updateOne(
                {
                    userRef: userRef,
                    gameRef: gameRef
                },
                { $set: dados })
            return result
        } catch (err) {
            console.error("Erro em ReviewDAO.editarReview: ", err)

            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                return {
                    status: 503, //serviço insdisponível
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            return {
                status: 500, //erro genérico
                error: "Desculpe, ocorreu um erro interno no servidor."
            };
        }
    }

    static async deletarReview(collection, userRef, gameRef) {
        try {
            const res = await collection.deleteOne({ userRef: userRef, gameRef: gameRef })
            return res;
        } catch (err) {
            console.error("Erro em ReviewDAO.deletarReview: ", err)

            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                return {
                    status: 503, //serviço insdisponível
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            return {
                status: 500, //erro genérico
                error: "Desculpe, ocorreu um erro interno no servidor."
            };
        }
    }

    static async getGameReviews(collection, gameRef) {
        try {
            const res = await collection.find({ gameRef: gameRef }).toArray();
            return res;
        } catch (err) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                console.error("Erro de rede: O banco de dados parece estar offline.", err);
                return {
                    status: 503, // Service Unavailable
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            console.error("Erro não esperado na função getGameReviews:", err);
            return {
                status: 500, // Internal Server Error
                error: err.message
            }
        };
    }
}

module.exports = ReviewDAO