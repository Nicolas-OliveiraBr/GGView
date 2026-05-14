import { Collection, ObjectId } from 'mongodb';
import { error } from 'node:console';
import { isEmail } from "validator"


//Modelo de usuário
export interface IUser {
    userName: string
    email: string
    senhaHash: string
    bio?: string
    dataNasc: Date
    // sempre que um novo usuario for criado ele começara com essas listas vázias, por isso não coloque um ? como em bio 
    // OBS:
    seguidores: ObjectId[]
    seguindo: ObjectId[]
    jogosCurt: string[]
    jogosFav: string[]
    jogados: string[]
}

export default class UserDAO {
    static async cadastrarUsuario(collection: Collection<IUser>, user: IUser) {
        //LIDANDO: casos de dados inválidos/faltando
        if (!user.userName || !user.email || !user.senhaHash || !user.dataNasc) {
            return { error: "Campo obrigatório(userName, email, senhaHash e/ou dataNasc) faltando" }
        }

        if (isNaN(user.dataNasc.getDate())) {
            return { error: "Data de nascimento inválida" }
        }

        if (!isEmail(user.email)) {
            return { error: "Email inválido" }
        }
        //

        try {
            const result = await collection.insertOne(user)
            return result

        } catch (err: any) {
            console.error("Erro em UserDAO.cadastrarUser", err)
            //LIDANDO: erros internos no servidor do banco de dados
            //erro de repetição de dado do tipo 
            if (err.code === 11000) {
                return {
                    status: 409, //erro de conflito
                    error: "Email ou usuário já cadastrado"
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

    //OBS: este código servira para adicionar a qualquer lista
    static async add_delJogo(collection: Collection<IUser>, email: string, lista: string, jogo: string, isAdd: boolean) {
        try {
            let result
            if (isAdd) {
                return await collection.updateOne(
                    {email: email},
                    {$addToSet: {[lista]: jogo}}
                )
            }
            return await collection.updateOne(
                {email: email},
                {$pull: {[lista]: jogo}}
            )
        }
        catch (err: any) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                return {
                    status: 503, //serviço insdisponível
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            console.error("Erros não considerados:", err)
            return {
                status: 500,
                error: "Ocorreu um erro interno ao salvar as alterações."
            }
        }
    }

    static async atualizarUsuario(collection: Collection<IUser>, email: string, dados: object) {
        try {
            const result = collection.updateOne(
                {email: email},
                {$set: dados}
            )
            return result
        } catch (err: any) {
            if (err.code === 11000) {
                return { status: 409, error: "Este nome de usuário já está sendo usado por outra pessoa." };
            }

            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                return {
                    status: 503, //serviço insdisponível
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            console.error("Erros não considerados:", err)
            return {
                status: 500,
                error: "Ocorreu um erro interno ao salvar as alterações."
            }
        }
            
    }
}
