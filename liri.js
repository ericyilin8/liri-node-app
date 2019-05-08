var fs = require("fs");
require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');

var command = process.argv[2];
var input = process.argv[3];

switch (command) {
    case 'concert-this':
        concert(input);
        break;
    case `spotify-this-song`:
        spotifySong(input);
        break;
    case `movie-this`:
        movie(input);
        break;
    case `do-what-it-says`:
        dothis();
        break;
    default:
        console.log("Sorry I don't understand.");
}

function concert(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            response.data.forEach(function(current){
                console.log("Venue Name: " + current.venue.name);
                console.log("Location: " + current.venue.city + ', ' + current.venue.country);
                var datetime = moment(current.datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");
                console.log("Time: " + datetime);

            })
        })
}

function spotifySong(song) {

    if(!song){
        song = 'The Sign by Ace of Base';
    }
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Name: " + data.tracks.items[0].name);
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

function movie(movie) {
    if(!movie){
        movie = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
        .then(
            function (response) {

                var imdb, rotten;

                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);

                var ratings = response.data.Ratings;
                ratings.forEach(function (currentvalue) {
                    var source = currentvalue.Source;
                    if (source == 'Internet Movie Database') {
                        imdb = currentvalue.Value;
                    }
                    else if (source == 'Rotten Tomatoes') {
                        rotten = currentvalue.Value;
                    }
                });

                console.log("IMDB Rating: " + imdb);
                console.log("Rotten Tomaties Rating: " + rotten);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            }
        );
}

function dothis() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        var trimmed = data.trim();
        var args = trimmed.split(',');
        console.log(args);
    })
}