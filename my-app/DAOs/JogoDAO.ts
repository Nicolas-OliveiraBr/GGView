import { Collection, ObjectId } from 'mongodb';

export interface IJogo {
    _id: ObjectId
    id_igdb: string
    mediaAvaliacoes: number
    //CONTADORES  
    nAvaliacoes: number
    jogaram: number
    likes: number
    favoritaram: number
    //
}

export default class jogoDAO {
    //FUNÇÃO PARA IDENTIFICAR UM JOGO NO BD
    static async addGame(collection: Collection<IJogo>, id_igdb: string) {
        try {
            const result = await collection.insertOne({
                _id: new ObjectId(id_igdb),
                id_igdb: id_igdb,
                mediaAvaliacoes: 0,
                nAvaliacoes: 0,
                jogaram: 0,
                likes: 0,
                favoritaram: 0
            })
            return result;
        } catch (err: any) {
            console.error("Erro em UserDAO.cadastrarUser: ", err)
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
    static async plusOneToCounter(collection: Collection<IJogo>, id_igdb: string, counter: string) {
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
        } catch (err: any) {
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
    static async minusOneToCounter(collection: Collection<IJogo>, id_igdb: string, counter: string) {
        if (counter === "mediaAvaliacoes") {
            return { error: "Este atributo não pode ser modificado por essa função." }
        }

        try {
            const result = await collection.updateOne(
                { id_igdb: id_igdb },
                { $inc: { [counter]: -1 } })
            return result
        } catch (err: any) {
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
    static async identifyNewReview(collection: Collection<IJogo>, id_igdb: string, avaliacao: number) {
        try {
            var novaMedia;
            //Adquiri os valores anteriores das avaliações
            const resFind = await collection.findOne({ id_igdb }, {
                projection: { nAvaliacoes: 1, mediaAvaliacoes: 1 }
            })

            if (resFind) { //CALCULA A NOVA MÉDIA A PARTIR DOS VALORES ANTIGOS
                novaMedia = ((resFind.nAvaliacoes * resFind.mediaAvaliacoes) + avaliacao) / (resFind.nAvaliacoes + 1)
            }
            else { //TRATAMENTO DE POSSÍVEL NULABILIDADE
                return { error: "Jogo não encontrado" }
            }

            //ADIDCIONA OS NOVOS VALORES AO BD.
            const [resCounter, resMedia] = await Promise.all([
                this.plusOneToCounter(collection, id_igdb, "nAvaliacoes"),
                collection.updateOne({ id_igdb: id_igdb }, { $set: { mediaAvaliacoes: novaMedia } })
            ])
            
            return {
                resFind: resFind,
                resCounter: resCounter,
                resMedia: resMedia,
            }
        } catch (err: any) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                console.error("Erro de rede: O banco de dados parece estar offline.", err);
                return {
                    status: 503, // Service Unavailable
                    body: { error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde." }
                };
            }

            if (err.name === 'MongoServerError' && err.code === 121) {
                console.error("Erro de validação no Schema do MongoDB.", err);
                return {
                    status: 400, // Bad Request (Dados enviados geraram um cálculo inválido)
                    body: { error: "Os dados calculados não são válidos para as regras do banco." }
                };
            }

            console.error("Erro não esperado na função IdentificarReview:", err);
            return {
                status: 500, // Internal Server Error
                body: {
                    error: "Erro interno do servidor.",
                    detalhes: err.message
                }
            };
        }
    }

    static async getGame(collection: Collection<IJogo>, id_igdb: string) {
        try {
            const res = await collection.findOne({id_igdb: id_igdb}, {projection: {_id: 0, id_igdb: 0}});
            if(res === null) {
                const res2 = await this.addGame(collection, id_igdb);
                return {
                    aviso: "Jogo não encontrado no banco de dados do GGView e será adicionado",
                    res: res2
                };
            }
            return res;
        } catch(err: any) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                console.error("Erro de rede: O banco de dados parece estar offline.", err);
                return {
                    status: 503, // Service Unavailable
                    body: { error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde." }
                };
            }

            console.error("Erro não esperado na função getGame:", err);
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