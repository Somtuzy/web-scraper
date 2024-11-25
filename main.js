const axios = require('axios');
const cheerio = require('cheerio');
const express = require("express")

const app = express()

async function scrapeSite(keyword) {
    const url = `https://www.google.com/search?q=${keyword}&tbm=isch`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];

    // Select videos within the "mozaique" div
    $('your-class').each((i, elem) => {
        const videoAnchor = $(elem).find('.title a'); // Find the anchor tag within the video block
        const videoHref = videoAnchor.attr('href'); // Get the 'href' attribute of the anchor
        const videoTitle = videoAnchor.attr('title'); // Get the 'title' attribute
        const videoDuration = $(elem).find('.duration').first().text(); // Extract the video duration
        const videoImage = $(elem).find('img').attr('data-src'); // Get the video thumbnail image URL

        results.push({
            title: videoTitle || 'No title available',
            href: videoHref ? `https://www.google.com${videoHref}` : 'No link available',
            duration: videoDuration || 'No duration available',
            thumbnail: videoImage || 'No image available',
        })
    })
    return results;
}

app.get('/', (req, res) => {
    const keyword = "coffee"; //change with any keyword you want
    scrapeSite(keyword).then(result => {
        console.log(result)
        res.send(result)
    }).catch(err => console.log(err));
})

app.listen(9000, () => {
    console.log('connected');
})