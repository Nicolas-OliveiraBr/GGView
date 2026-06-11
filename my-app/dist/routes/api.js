"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserDAO_1 = __importDefault(require("../DAOs/UserDAO"));
const mongodb_1 = require("mongodb");
const bcrypt = __importStar(require("bcrypt"));
//peso do hash de senha
const saltRounds = 10;
//verifica se existem as variáveis de ambiente nescessárias(MongoURI; DB)
if (!process.env.MongoURI) {
    throw new Error("A variável de ambiente MongoURI não foi definida!");
}
//CONEXÃO
const client = new mongodb_1.MongoClient(process.env.MongoURI);
const db = client.db(process.env.DB);
//COLEÇÕES 
const userColl = db.collection("usuarios");
var router = (0, express_1.Router)();
router.get("/usuario/cadastro/:userName/:email/:senha/:dataNasc", async (req, res, next) => {
    // HASH DE SENHA(para segurança de dados)
    let senhaHash;
    try {
        if (!req.params.senha) {
            return res.status(400).json({ error: "Senha não fornecida" });
        }
        senhaHash = await bcrypt.hash(String(req.params.senha).trim(), saltRounds);
    }
    catch (err) {
        console.error("Erro ao gerar hash:", err);
        return res.status(500).json({ erro: "Erro interno" });
    }
    // define o documento .json inicial de usuario
    // OBS: trim lida com espaços no começo e no fim de cada string passada
    const user = {
        userName: String(req.params.userName).trim(),
        email: String(req.params.email).trim(),
        senhaHash: senhaHash,
        dataNasc: new Date(String(req.params.dataNasc)),
        seguidores: [],
        seguindo: [],
        jogosCurt: [],
        jogosFav: [],
        jogados: []
    };
    const resJson = await UserDAO_1.default.cadastrarUsuario(userColl, user); //usa a função de cadastro passando o documento de usuario e guarda o json de resposta
    res.json(resJson);
});
exports.default = router;
//# sourceMappingURL=api.js.map