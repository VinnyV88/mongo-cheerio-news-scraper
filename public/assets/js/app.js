$(document).ready(function() {

$(document).on("click", "#get-articles", function() {

$.getJSON("/scrape", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    var $articleRow = $("<div>").addClass("row");
    var $articeBoxDiv = $("<div>").addClass("article-box text-left col-md-10 col-md-offset-1");
    var $headerRow = $("<div>").addClass("row");
    var $linkDiv = $("<div>").addClass("article-title col-md-12");
    var $a = ($("<a>").addClass("article-link").attr("href", data[i].link).attr("target", "_blank"));
    var $button = $("<button>").addClass("btn-danger save-article col-md-1").text("Save Article").data("title", data[i].title)
                  .data("link", data[i].link).data("blurb", data[i].blurb)
    var $blurbRow = $("<div>").addClass("row");
    var $p = $("<p>").addClass("article-blurb col-md-12").text(data[i].blurb);

    
    $a.text(data[i].title);
    $linkDiv.append($a).append($button);
    $headerRow.append($linkDiv)

    $blurbRow.append($p);

    $articeBoxDiv.append($headerRow).append($blurbRow)

    $articleRow.append($articeBoxDiv);
    $("#articles").append($articleRow);
  }
});

});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


});