$(document).ready(function () {

  $(document).on("click", "#get-articles", function () {

    $.getJSON("/scrape", function (data) {
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


  $(document).on("click", ".save-article", function () {
    var articleTitle = $(this).data("title");
    var articleLink = $(this).data("link");
    var articleBlurb = $(this).data("blurb");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/article",
        data: {
          title: articleTitle,
          link: articleLink,
          blurb: articleBlurb
        }
      })
      .done(function (data) {
        // Log the response
        console.log(data);
      });

    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    // $("#bodyinput").val("");
  });


});