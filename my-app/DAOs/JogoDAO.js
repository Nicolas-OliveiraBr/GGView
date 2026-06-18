const { Double } = require('mongodb');

mongodb = require('mongodb')

class JogoDAO {
    //FUNÇÃO PARA IDENTIFICAR UM JOGO NO BD
    static async addGame(collection, id_igdb) {
        try {
            const result = await collection.insertOne({
                id_igdb: id_igdb,
                mediaAvaliacoes: new Double(0.0),
                nAvaliacoes: 0,
                jogaram: 0,
                likes: 0,
                favoritaram: 0
            })
            return result;
        } catch (err) {
            console.error("Erro em JogoDAO.addGame: ", JSON.stringify(err,null,2))
            //LIDANDO: erros internos no servidor do banco de dados
            //erro de repetição de dado do tipo 
            if (err.code === 11000) {
                return {
                    status: 409, //erro de conflito
                    error: "Jogo já identificado no banco de dados."
                }
            }

            //erro de falta, atraso ou de conexão instável
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
            //
        }
    }

    //SOMA +1 A UM CONTADOR(jogaram, likes, favoritaram ou nAvaliacoes)
    static async plusOneToCounter(collection, id_igdb, counter) {
        if (counter === "mediaAvaliacoes") {
            return { error: "Este atributo não pode ser modificado por essa função." }
        }
        //verifica se o atributo existe na lista
        else if (!["jogaram", "likes", "favoritaram", "nAvaliacoes"].includes(counter)) {
            return { error: "Counter inexistente." }
        }

        try {
            const result = await collection.updateOne(
                { id_igdb: id_igdb },
                { $inc: { [counter]: 1 } })
            return result
        } catch (err) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                return {
                    status: 503, //serviço insdisponível
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            console.error("Erros não tratado:", err)
            return {
                status: 500,
                error: "Ocorreu um erro interno ao salvar as alterações."
            }
        }
    }

    //SUBTRAI 1 DE UM CONTADOR(jogaram, likes, favoritaram ou nAvaliacoes)
    static async minusOneToCounter(collection, id_igdb, counter) {
        if (counter === "mediaAvaliacoes") {
            return { error: "Este atributo não pode ser modificado por essa função." }
        }
        //verifica se o atributo existe na lista
        else if (!["jogaram", "likes", "favoritaram", "nAvaliacoes"].includes(counter)) {
            return { error: "Counter inexistente." }
        }

        try {
            const result = await collection.updateOne(
                { id_igdb: id_igdb },
                { $inc: { [counter]: -1 } })
            return result
        } catch (err) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                return {
                    status: 503, //serviço insdisponível
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            console.error("Erros não tratado:", err)
            return {
                status: 500,
                error: "Ocorreu um erro interno ao salvar as alterações."
            }
        }
    }

    // IDENTIFICA UM NOVA REVIEW PARA MOSTRAR NA PÁGINA DO JOGO(função utilizada em reviewDAO)
    static async identifyNewReview(collection, id_igdb, avaliacao) {
        try {
            var novaMedia;
            //Adquiri os valores anteriores das avaliações
            const resFind = await collection.findOne({ id_igdb }, {
                projection: { nAvaliacoes: 1, mediaAvaliacoes: 1 }
            })

            if (resFind) { //CALCULA A NOVA MÉDIA A PARTIR DOS VALORES ANTIGOS
                avaliacao = Number(avaliacao);
                novaMedia = ((resFind.nAvaliacoes * resFind.mediaAvaliacoes) + avaliacao) / (resFind.nAvaliacoes + 1)
                novaMedia = Math.round(novaMedia*100)/100
                novaMedia = new Double(novaMedia)
            }
            else { //TRATAMENTO DE POSSÍVEL NULABILIDADE
                return { error: "Jogo não encontrado" }
            }

            //ADIDCIONA OS NOVOS VALORES AO BD.
            const resCounter = collection.updateOne({ id_igdb: id_igdb }, { $set: { mediaAvaliacoes: novaMedia }, $inc: {nAvaliacoes: 1}})

            return {
                resFind: resFind,
                resCounter: resCounter,
                // resMedia: resMedia,
            }
        } catch (err) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                console.error("Erro de rede: O banco de dados parece estar offline.", err);
                return {
                    status: 503, // Service Unavailable
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            if (err.name === 'MongoServerError' && err.code === 121) {
                console.error("Erro de validação no Schema do MongoDB.", err);
                return {
                    status: 400, // Bad Request (Dados enviados geraram um cálculo inválido)
                    error: "Os dados calculados não são válidos para as regras do banco."
                };
            }

            console.error("Erro não esperado na função JogoDAO.IdentificarReview:", JSON.stringify(err, null, 2));
            return {
                status: 500, // Internal Server Error
                error: err.message

            };
        }
    }

    static async getGame(collection, id_igdb) {
        try {
            const res = await collection.findOne({ id_igdb: id_igdb }, { projection: { _id: 0, id_igdb: 0 } });
            if (res === null) {
                const res2 = await JogoDAO.addGame(collection, id_igdb);
                return {
                    aviso: "Jogo não encontrado no banco de dados do GGView e será adicionado",
                    resAddGame: res2,
                    res: res
                };
            }
            return res;
        } catch (err) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                console.error("Erro de rede: O banco de dados parece estar offline.", err);
                return {
                    status: 503, // Service Unavailable
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            console.error("Erro não esperado na função getGame:", err);
            return {
                status: 500, // Internal Server Error
                error: err.message
            };
        }
    }
}

module.exports = JogoDAO