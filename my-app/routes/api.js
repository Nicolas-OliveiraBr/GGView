const UserDAO = require("../DAOs/UserDAO.js");
const ReviewDAO = require("../DAOs/ReviewDAO.js");
const JogoDAO = require("../DAOs/JogoDAO.js");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { ObjectId } = require("mongodb");
const mongodb = require("mongodb")


//peso do hash de senha
const saltRounds = 10

//verifica se existem as variáveis de ambiente nescessárias(MongoURI; DB)
if (!process.env.MongoURI) {
    throw new Error("A variável de ambiente MongoURI não foi definida!");
}

//CONEXÃO
const client = new mongodb.MongoClient(process.env.MongoURI);
const db = client.db(process.env.DB);

//COLEÇÕES 
const userColl = db.collection("usuarios");
const jogoColl = db.collection("jogos");
const reviewColl = db.collection("reviews");


var router = Router();

router.post("/usuario/cadastro", async (req, res, next) => {
    const { userName, email, senha, dataNasc } = req.body;

    // HASH DE SENHA(para segurança de dados)
    let senhaHash
    try {
        if (!senha) {
            return res.status(400).json({ error: "Senha não fornecida" })
        }
        senhaHash = await bcrypt.hash(String(senha).trim(), saltRounds)
    } catch (err) {
        console.error("Erro ao gerar hash:", err);
        return res.status(500).json({ erro: "Erro interno" });
    }

    // define o documento .json inicial de usuario
    // OBS: trim lida com espaços no começo e no fim de cada string passada
    const user = {
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

    try {
        const resultado = await UserDAO.cadastrarUsuario(userColl, user)//usa a função de cadastro passando o documento de usuario e guarda o json de resposta
        if (resultado && resultado.status) {
            return res.status(resultado.status).json(resultado)
        }
        res.status(201).json(resultado)
    } catch (err) {
        console.error("Erro na rota /usuario/cadastro:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
})

router.post('/usuario/login', async (req, res, next) => {
    const resultado = await UserDAO.loggin(userColl, req.body);

    if (resultado.token) {
        // Configura o cookie aqui na rota, onde o 'res' existe!
        res.cookie('user_token', resultado.token, {
            httpOnly: true,
            secure: false, // true em produção
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }

    return res.status(resultado.status).json(resultado);
})

router.get("/jogo/get/:id_igdb", async (req, res, next) => {
    try {
        const { id_igdb } = req.params;
        if (!id_igdb) {
            return res.status(400).json({ error: "Id de jogo não fornecida" })
        }
        const resultado = await JogoDAO.getGame(jogoColl, String(id_igdb));

        if (resultado && 'status' in resultado) {
            return res.status(resultado.status).json(JSON.stringify(resultado,null,2));
        }

        return res.status(200).json(JSON.stringify(resultado,null,2));
    } catch (err) {
        console.error("Erro na rota /jogo/get:", JSON.stringify(err,null,2));
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
})

router.put("/jogo/put/plusonetocounter/:id_igdb", async (req, res, next) => {
    try {
        const { id_igdb } = req.params;
        if (!id_igdb) {
            return res.status(400).json({ error: "Id de jogo não fornecida" })
        }
        const { counter } = req.body;
        const resultado = await JogoDAO.plusOneToCounter(jogoColl, String(id_igdb), counter)

        if (resultado && 'status' in resultado) {
            return res.status(resultado.status).json(resultado.error);
        }

        return res.status(200).json({ message: "Contador incrementado com sucesso.", resultado });
    } catch (err) {
        console.error("Erro na rota /jogo/plusonetocounter:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
})

router.put("/jogo/put/minusonetocounter/:id_igdb", async (req, res, next) => {
    try {
        const { id_igdb } = req.params;
        if (!id_igdb) {
            return res.status(400).json({ error: "Id de jogo não fornecida" })
        }
        const { counter } = req.body;
        const resultado = await JogoDAO.minusOneToCounter(jogoColl, String(id_igdb), counter)

        if (resultado && 'status' in resultado) {
            return res.status(resultado.status).json(resultado.error);
        }

        return res.status(200).json({ message: "Contador decrementado com sucesso.", resultado });
    } catch (err) {
        console.error("Erro na rota /jogo/minusonetocounter:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
})

router.post("/review/post", async (req, res, next) => {
    try {
        const { gameRef, userRef, userName, descricao, avaliacao, curtidas, data } = req.body;

        if (gameRef === undefined || gameRef ===null || userRef ===undefined || userRef === null || userName === undefined || userName === null || descricao === undefined || descricao === null || data === undefined || data === null || avaliacao === undefined || avaliacao === null || curtidas === undefined || curtidas === null) {
            return res.status(400).json({ error: "Argumento não passado na review!" });
        }

        const review = {
            gameRef: gameRef,
            userName: userName,
            userRef: new ObjectId(userRef),
            descricao: descricao,
            avaliacao: avaliacao,
            curtidas: curtidas,
            data: new Date(data)
        }

        const resultado = await ReviewDAO.criarReview(reviewColl, jogoColl, review)

        if (resultado && resultado.status) {
            return res.status(resultado.status).json(JSON.stringify(resultado, null, 2))
        }

        return res.status(200).json({ message: "Review postada com sucesso.", resultado });
    } catch (err) {
        console.error("Erro na rota /review/post:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
});

router.put("/review/put/:id_igdb/:id_user", async (req, res, next) => {
    try {
        const { changes } = req.body;
        const { id_user, id_igdb } = req.params;

        if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
            return res.status(400).json({ error: "O campo 'review' deve ser um objeto válido." });
        }
        const id_userobj = new ObjectId(String(id_user))

        const resultado = await ReviewDAO.editarReview(reviewColl, id_userobj, String(id_igdb), changes)

        if (resultado && resultado.status) {
            return res.status(resultado.status).json(resultado)
        }

        return res.status(200).json({ message: "Review atualizada com sucesso.", resultado });
    } catch (err) {
        console.error("Erro na rota /review/put:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
});

router.get("/review/get/gameReviews/:id_igdb", async (req, res, next) => {
    try {
        const { id_igdb } = req.params;
        if (!id_igdb) {
            return res.status(400).json({ error: "Id de jogo não fornecida" })
        }

        const resultado = await ReviewDAO.getGameReviews(reviewColl, String(id_igdb))

        if (resultado && resultado.status) {
            return res.status(resultado.status).json(resultado)
        }

        return res.status(200).json({ resultado });
    } catch (err) {
        console.error("Erro na rota /review/get/gameReviews:", err);
        return res.status(500).json({ error: "Erro interno na rota do servidor." });
    }
});

module.exports = router;