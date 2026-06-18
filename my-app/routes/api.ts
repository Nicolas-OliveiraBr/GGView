
import { Router, Request, Response, NextFunction } from "express";
import UserDAO, {IUser} from "../DAOs/UserDAO";
import ReviewDAO, {IReview} from "../DAOs/ReviewDAO";
import JogoDAO, {IJogo} from "../DAOs/JogoDAO";
import { Collection, MongoClient, ObjectId } from "mongodb";
import * as bcrypt from "bcrypt"

//peso do hash de senha
const saltRounds = 10

//verifica se existem as variáveis de ambiente nescessárias(MongoURI; DB)
if (!process.env.MongoURI) {
    throw new Error("A variável de ambiente MongoURI não foi definida!");
}

//CONEXÃO
const client = new MongoClient(process.env.MongoURI);
const db = client.db(process.env.DB);

//COLEÇÕES 
const userColl: Collection<IUser> = db.collection("usuarios");
const jogoColl: Collection<IJogo> = db.collection("jogos");
const reviewColl: Collection<IReview> = db.collection("reviews");


var router = Router();

router.post("/usuario/cadastro", async (req : Request, res : Response, next : NextFunction) => {
    const { userName, email, senha, dataNasc } = req.body;

    // HASH DE SENHA(para segurança de dados)
    let senhaHash
    try {
        if (senha) {
            return res.status(400).json({error: "Senha não fornecida"})
        }
        senhaHash = await bcrypt.hash(String(senha).trim(), saltRounds)
    } catch (err) {
        console.error("Erro ao gerar hash:", err);
        return res.status(500).json({ erro: "Erro interno" });
    }

    // define o documento .json inicial de usuario
    // OBS: trim lida com espaços no começo e no fim de cada string passada
    const user: IUser = {
        userName: String(userName).trim(),
        email: String(email).trim(),
        senhaHash: senhaHash,
        dataNasc: new Date(String(dataNasc)), 
        seguidores: [],
        seguindo: [],
        jogosCurt: [],
        jogosFav: [],
        jogados: []
    }
    const resJson = await UserDAO.cadastrarUsuario(userColl, user)//usa a função de cadastro passando o documento de usuario e guarda o json de resposta
    res.json(resJson)
})

router.get("/jogo/get/:id_igdb", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id_igdb } = req.params;
        if(!id_igdb) {
            return res.status(400).json({error: "Id de jogo não fornecida"})
        }
        const resultado = await JogoDAO.getGame(jogoColl, String(id_igdb));

        if (resultado && 'status' in resultado) {
            return res.status(resultado.status).json(resultado.body);
        }

        return res.status(200).json(resultado);
    } catch (err) {
        console.error("Erro na rota /jogo/get:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
})

router.put("/jogo/put/plusonetocounter/:id_igdb", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_igdb } = req.params;
        if(!id_igdb) {
            return res.status(400).json({error: "Id de jogo não fornecida"})
        }
        const { counter } = req.body;
        const resultado = await JogoDAO.plusOneToCounter(jogoColl, String(id_igdb), counter)

        if (resultado && 'status' in resultado) {
            return res.status(resultado.status).json(resultado.error);
        }

        return res.status(200).json({ message: "Contador incrementado com sucesso.", resultado });
    } catch(err) {
        console.error("Erro na rota /jogo/plusonetocounter:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
})

router.put("/jogo/put/minusonetocounter/:id_igdb", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_igdb } = req.params;
        if(!id_igdb) {
            return res.status(400).json({error: "Id de jogo não fornecida"})
        }
        const { counter } = req.body;
        const resultado = await JogoDAO.plusOneToCounter(jogoColl, String(id_igdb), counter)

        if (resultado && 'status' in resultado) {
            return res.status(resultado.status).json(resultado.error);
        }

        return res.status(200).json({ message: "Contador decrementado com sucesso.", resultado });
    } catch(err) {
        console.error("Erro na rota /jogo/minusonetocounter:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
})

router.post("/review/post", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { review } = req.body;
        
        if (!review || typeof review !== 'object') {
            return res.status(400).json({ error: "O campo 'review' deve ser um objeto válido." });
        }
        
        const resultado = await ReviewDAO.criarReview(reviewColl, jogoColl, review)

        return res.status(200).json({ message: "Review postada com sucesso.", resultado });
    } catch(err) {
        console.error("Erro na rota /review/post:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
});

router.put("/review/put/:id_igdb/:id_user", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { changes } = req.body;
        const { id_user, id_igdb } = req.params;
        
        if (!changes || typeof changes !== 'object') {
            return res.status(400).json({ error: "O campo 'review' deve ser um objeto válido." });
        }
        const id_userobj = new ObjectId(String(id_user))

        const resultado = await ReviewDAO.editarReview(reviewColl, id_userobj, String(id_igdb), changes)
        return res.status(200).json({ message: "Review atualizada com sucesso.", resultado });
    } catch(err) {
        console.error("Erro na rota /review/put:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
});

router.get("/review/get/gameReviews/:id_igdb", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_igdb } = req.params;
        if(!id_igdb) {
            return res.status(400).json({error: "Id de jogo não fornecida"})
        }
        
        const resultado = await ReviewDAO.getGameReviews(reviewColl, String(id_igdb))
        return res.status(200).json({ resultado });
    } catch(err) {
        console.error("Erro na rota /review/get/gameReviews:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
});
export default router;