const { query } = require('./igdbClient');

class igdbGames {

    static async buscarPorNome (nome) {
        return await query(
            "games",
            `search "${nome}";
            fields id, name, cover.image_id; 
            limit 1;` //, first_release_date, platforms.name, genres.name, summary
        )
    }

    static async buscarPopulares () {
        return await query(
            "games",
            `fields id, name, cover.image_id;
            where rating != null;
            sort rating desc;
            limit 20;`
        )
    }

    static async buscarPorId (id) {
        return await query(
            "games",
            `fields name, summary, first_release_date, age_ratings.rating, age_ratings.category,
            genres.name, platforms.name, cover.image_id, screenshots.image_id, videos.video_id, 
            involved_companies.company.name, involved_companies.developer;
            where id = ${id};`
        )
    }

    static async bucarLançamentos () {
        return await query(
            "games",
            `fields id, name, cover.image_id;
            where first_release_date > ${Math.floor(Date.now() / 1000)};
            sort first_release_date asc;
            limit 20;`
        )
    }

    static async buscarRecentes () {
        return await query(
            "games",
            `
            fields id, name, cover.image_id, first_release_date;
            where first_release_date != null;
            sort first_release_date desc;
            limit 20;
            `
        );
    }
}

module.exports = igdbGames;