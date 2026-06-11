const { obterToken } = require("./igdbAuth");

require("dotenv").config();

async function query(endpoint, body) {

    const token = await obterToken();

    //console.log(token)

    console.log(endpoint, body)
    
    const response = await fetch(
        `https://api.igdb.com/v4/${endpoint}`,
        {
            method: "POST",
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "text/plain"
            },
            body
        }
    );

    if (!response.ok) {
        throw new Error(`IGDB Error: ${response.status}`);
    }

    const data = await response.json();

    //console.log(JSON.stringify(data, null, 2));

    return data;
}

module.exports = {
    query
};