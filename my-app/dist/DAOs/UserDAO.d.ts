import { Collection, ObjectId } from 'mongodb';
export interface IUser {
    userName: string;
    email: string;
    senhaHash: string;
    bio?: string;
    dataNasc: Date;
    seguidores: ObjectId[];
    seguindo: ObjectId[];
    jogosCurt: string[];
    jogosFav: string[];
    jogados: string[];
}
export default class UserDAO {
    static cadastrarUsuario(collection: Collection<IUser>, user: IUser): Promise<import("mongodb").InsertOneResult<IUser> | {
        error: string;
        status?: never;
    } | {
        status: number;
        error: string;
    }>;
    static add_delJogo(collection: Collection<IUser>, email: string, lista: string, jogo: string, isAdd: boolean): Promise<import("mongodb").UpdateResult<IUser> | {
        status: number;
        error: string;
    }>;
    static atualizarUsuario(collection: Collection<IUser>, email: string, dados: object): Promise<import("mongodb").UpdateResult<IUser> | {
        status: number;
        error: string;
    }>;
}
//# sourceMappingURL=UserDAO.d.ts.map