import { Collection, ObjectId } from 'mongodb';
import identifyNewReview, { IJogo } from './JogoDAO';
import jogoDAO from './JogoDAO';

export interface IReview {
    userRef: ObjectId
    gameRef: string
    descricao: string
    avaliacao: number
    curtidas: number
    data: Date
}

export default class ReviewDAO {
    static async criarReview(collectionReview: Collection<IReview>,collectionJogo: Collection<IJogo>, review: IReview) {
        try {
            const [resInsertReview, resIdentfyReview ] = await Promise.all([collectionReview.insertOne(review), jogoDAO.identifyNewReview(collectionJogo, review.gameRef, review.avaliacao)]);
            return {
                resInsertReview: resInsertReview,
                resIdentfyReview: resIdentfyReview
            };
        } catch (err: any) {
            console.error("Erro em ReviewDAO.criarReview: ", err)
            
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

    static async editarReview(collection : Collection<IReview>, userRef: ObjectId, gameRef: string, dados: Record<string, any>) {
        try {
            const result = await collection.updateOne(
            {
                userRef: userRef,
                gameRef: gameRef
            }, 
            {$set: dados})
            return result
        } catch(err: any) {
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

    static async deletarReview(collection : Collection<IReview>, userRef: ObjectId, gameRef: string) {
        try{
            const res = await collection.deleteOne({userRef: userRef, gameRef: gameRef})
            return res;
        } catch(err: any) {
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

    static async getGameReviews(collection: Collection<IReview>, id_igdb: string) {
        try {
            const res = collection.find({id_igdb: id_igdb}).toArray();
            return res;
        } catch(err: any) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                console.error("Erro de rede: O banco de dados parece estar offline.", err);
                return {
                    status: 503, // Service Unavailable
                    body: { error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde." }
                };
            }

            console.error("Erro não esperado na função getGameReviews:", err);
            return {
                status: 500, // Internal Server Error
                body: {
                    error: "Erro interno do servidor.",
                    detalhes: err.message
                }
            };
        }
    }
}
