require("dotenv").config();

async function obterToken() {
    try {
        const response = await fetch(
            "https://id.twitch.tv/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: "client_credentials"
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // console.log(data);

        return data.access_token;

    } catch (error) {
        console.error("Error fetching access token:", error);
        throw error;
    }
}

module.exports = {
    obterToken
};