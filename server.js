var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
var Q = require("q");
// Q is a Promise library used to add promises to functions that do not have them natively 
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/wapoNewsScraper");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the wapo website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request

  request("http://www.washingtonpost.com/", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    var results = [];
    // Now, we grab every headline within an div tag, and do the following:
    Q.nfcall($("div.headline").each(function (i, element) {

      // Save an empty result object
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.blurb = $(this).siblings("div.blurb").text();

      if (result.title && result.link) results.push(result);

    })).then(res.send(results))
  })
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function (req, res) {


  // TODO: Finish the route so it grabs all of the articles


});

// This will grab an article by it's ObjectId
app.get("/articles/:id", function (req, res) {


  // TODO
  // ====

  // Finish the route so it finds one article using the req.params.id,

  // and run the populate method with "note",

  // then responds with the article with the note included


});

// Create a new note or replace an existing note
app.post("/article", function (req, res) {

      var data = {};

      console.log(req.body);

      data.title = req.body.title;
      data.link = req.body.link;
      data.blurb = req.body.blurb;

      var entry = new Article(data);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
          res.send(doc);
        }
      });


  // TODO
  // ====

  // save the new note that gets posted to the Notes collection

  // then find an article from the req.params.id

  // and update it's "note" property with the _id of the new note


});


// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});