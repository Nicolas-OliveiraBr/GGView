const { query } = require('./igdbClient');

class igdbGames {

    static async buscarPorNome (nome) {
        return await query(
            "games",
            `search "${nome}";
            fields name, cover.image_id, first_release_date, platforms.name, genres.name, summary; 
            limit 1;` //, first_release_date, platforms.name, genres.name, summary
        )
    }
}

igdbGames.buscarPorNome("The Witcher 3");

module.exports = igdbGames;