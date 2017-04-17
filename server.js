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

// This will get the articles we saved to the mongoDB
app.get("/articles", function (req, res) {

  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });

});

// This will grab an article by it's ObjectId
app.delete("/articles/:id", function (req, res) {

  Article.findByIdAndRemove(req.params.id, function (err, doc) {  
      // We'll create a simple object to send back with a message and the id of the document that was removed
      // You can really do this however you want, though.
      var response = {
          message: "Article successfully deleted",
          id: doc._id
      };
      res.send(response);
  });


});



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
});

app.get("/notes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("notes")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

app.post("/note/:articleId", function (req, res) {
      
      var article_id = req.params.articleId;
      var data = {};

      console.log(req.body);

      data.title = req.body.title;
      data.body = req.body.body;

      var note = new Note(data);

      // Now, save that note to the db
      note.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          Article.findOneAndUpdate({_id: article_id}, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
            // Send any errors to the browser
            if (err) {
              console.log(err);
            }
            // Or send the newdoc to the browser
            else {
              res.send(newdoc);
            }
          });
        }
      });
});


// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});