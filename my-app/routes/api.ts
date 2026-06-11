
import { Router, Request, Response, NextFunction } from "express";
import UserDAO from "../DAOs/UserDAO"
import {IUser} from "../DAOs/UserDAO"
import { Collection, MongoClient } from "mongodb";
import * as bcrypt from "bcrypt"

//peso do hash de senha
const saltRounds = 10

//verifica se existem as variáveis de ambiente nescessárias(MongoURI; DB)
if (!process.env.MongoURI) {
    throw new Error("A variável de ambiente MongoURI não foi definida!");
}

//CONEXÃO
const client = new MongoClient(process.env.MongoURI)
const db = client.db(process.env.DB)

//COLEÇÕES 
const userColl: Collection<IUser> = db.collection("usuarios")



var router = Router();

router.get("/usuario/cadastro/:userName/:email/:senha/:dataNasc", async (req : Request, res : Response, next : NextFunction) => {
    // HASH DE SENHA(para segurança de dados)
    let senhaHash
    try {
        if (!req.params.senha) {
            return res.status(400).json({error: "Senha não fornecida"})
        }
        senhaHash = await bcrypt.hash(String(req.params.senha).trim(), saltRounds)
    } catch (err) {
        console.error("Erro ao gerar hash:", err);
        return res.status(500).json({ erro: "Erro interno" });
    }

    // define o documento .json inicial de usuario
    // OBS: trim lida com espaços no começo e no fim de cada string passada
    const user: IUser = {
        userName: String(req.params.userName).trim(),
        email: String(req.params.email).trim(),
        senhaHash: senhaHash,
        dataNasc: new Date(String(req.params.dataNasc)), 
        seguidores: [],
        seguindo: [],
        jogosCurt: [],
        jogosFav: [],
        jogados: []
    }
    const resJson = await UserDAO.cadastrarUsuario(userColl, user)//usa a função de cadastro passando o documento de usuario e guarda o json de resposta
    res.json(resJson)
})


export default router;