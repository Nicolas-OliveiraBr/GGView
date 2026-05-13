
import { Router, Request, Response, NextFunction } from "express";
import UserDAO from "../DAOs/UserDAO"
import {IUser} from "../DAOs/UserDAO"
import { Collection, MongoClient } from "mongodb";
import { error } from "node:console";

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
    // define o documento .json inicial de usuario
    // OBS: trim lida com espaços no começo e no fim de cada string passada
    const user: IUser = {
        userName: String(req.params.userName).trim(),
        email: String(req.params.email).trim(),
        senhaHash: String(req.params.senha),
        dataNasc: new Date(String(req.params.dataNasc)), 
        seguidores: [],
        seguindo: [],
        jogosCurt: [],
        jogosFav: [],
        jogados: []
    }
    const resJson = await UserDAO.cadastrarUsuario(userColl, user)//usa a função de cadastro passando o documento de usuario e guarda o json de resposta
    res.json(JSON.parse(JSON.stringify(resJson, null, 2))) 
})


export default router;