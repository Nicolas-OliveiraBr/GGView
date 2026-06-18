const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

class UserDAO {
    static async cadastrarUsuario(collection, user) {
        //LIDANDO: casos de dados inválidos/faltando
        if (!user.userName || !user.email || !user.senhaHash || !user.dataNasc) {
            return { error: "Campo obrigatório(userName, email, senhaHash e/ou dataNasc) faltando" }
        }

        if (isNaN(user.dataNasc.getDate())) {
            return { error: "Data de nascimento inválida" }
        }

        if (!validator.isEmail(user.email)) {
            return { error: "Email inválido" }
        }
        //

        try {
            const result = await collection.insertOne(user)
            return result

        } catch (err) {
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

    static async loggin(collection, tentativa) {
        if (!tentativa.senha) {
            console.error("Campo de senha não pode estar vazio!")
            return { 
                status: 422,
                err: "Campo de senha não pode estar vazio!" }
        }
        if (!tentativa.email) {
            console.error("Campo de email não pode estar vazio!")
            return { 
                status: 422,
                err: "Campo de email não pode estar vazio!" }
        }


        try {
            const user = await collection.findOne({ email: tentativa.email })
            if (!user) {
                return { 
                    status: 404,
                    res: "Usuário inexiste." }
            }

            const check_password = await bcrypt.compare(tentativa.senha, user.senhaHash);

            if (!check_password) {
                return { 
                    status: 422,
                    error: "Senha vazia." }
            }

            const SECRET = process.env.TOKEN_SECRET;

            const token = jwt.sign({ id: user._id, userName: user.userName }, SECRET, { expiresIn: '30d' })

            return{
                status: 200, 
                res: "Autenticação realizada com sucesso!",
                token
            }
        } catch (err) {
            console.error("Erro em UserDAO.login:", err);
            return {
                status: 500,
                error: "Erro interno do servidor"
            }
        }
    }

    //OBS: este código servira para adicionar a qualquer lista
    static async add_delGameToList(collection, email, lista, jogo, isAdding) {
        const operador = isAdding ? "$addToSet" : "$pull"
        try {
            return await collection.updateOne(
                { email: email },
                { [operador]: { [lista]: jogo } }
            )
        }
        catch (err) {
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

    static async atualizarUsuario(collection, email, dados) {
        try {
            const result = await collection.updateOne(
                { email: email },
                { $set: dados }
            )
            return result
        } catch (err) {
            if (err.code === 11000) {
                return { status: 409, error: "Este nome de usuário já está sendo usado por outra pessoa." };
            }

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

    static async follow_unfollow(collection, idSeguidorId, idSeguindoId, isFollowing) {
        const operador = isFollowing ? "$addToSet" : "$pull"
        try {
            const [resSeguidor, resSeguindo] = await Promise.all([
                collection.updateOne(
                    { _id: idSeguidorId },
                    { [operador]: { seguindo: idSeguindoId } }
                ),
                collection.updateOne(
                    { _id: idSeguindoId },
                    { [operador]: { seguidores: idSeguidorId } }
                )
            ])

            return {
                "resSeguidor": resSeguidor,
                "resSeguindo": resSeguindo
            }
        } catch (err) {
            if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.message.includes('topology')) {
                return {
                    status: 503, //serviço insdisponível
                    error: "Não foi possível conectar ao banco de dados. Verifique a sua internet e tente novamente mais tarde."
                };
            }

            console.error("Erro em follow_unfollow:", err)
            return {
                status: 500,
                error: "Ocorreu um erro interno ao salvar as alterações"
            }
        }
    }
}

module.exports = UserDAO
