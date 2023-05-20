const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const https = require('https');
const translate = require('translate-google');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("GET Request Called");
});

app.post("/translator", async (req, res) => {
    const { url, sourceLng, targetLanguage } = req.body;
    function fetchHTML(url) {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', async () => {
                const sourceHTML = {
                    url: url,
                    html: data
                };
                console.log("Source html ===", sourceHTML);

                // Translate the HTML to Target-Language
                const targetHTML = {
                    url: url,
                    html: await translate(data, { to: targetLanguage })
                };
                console.log(" target HTML === ", targetHTML);
                res.send(targetHTML);
            });
        }).on('error', (error) => {
            console.error(`Error fetching HTML: ${error}`);
        });
    }

    fetchHTML(url);
    // fetchHTML("https://example.com/");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Translator server at http://localhost:${port}`);
});

