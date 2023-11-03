require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:
app.get('/', (req,res) =>{
    res.render ("index")
})

app.get("/artist-search", (req,res) => {
    const { artist } = req.query

    spotifyApi.searchArtists(artist)
    .then(data => {
        const artists = data.body.artists.items
        console.log('The received data from the API: ', data.body)
        res.render ("artist-search-results", {artists})
    })
    .catch(error => {
        console.log("Error while searching artists", error);
        res.render("error"); // Cannot seem to be able to debug this properly but I have created the routes, moving on to next lab
    });
})

    app.get("/albums/:artistId", (req,res,next) => {
        const artistId = req.params.artistId

        spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            const albums = data.body.items;
            res.render("albums", { albums });
        })
        .catch(error => console.log('Error while fetching artist albums', error));

    })



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));




