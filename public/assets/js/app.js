$(document).ready(function () {

  $(document).on("click", "#get-articles", function () {

    document.body.style.cursor = "wait";

    $.getJSON("/scrape", function (data) {

      $("#articles").empty();

      document.body.style.cursor = "default";

      $(".info-message").html("<h3> " + data.length + " articles retrieved from the Washington Post!</h3>");
      $("#msgModal").modal("toggle");

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
        $(".info-message").html("<h3>Article Saved!</h3>");
        $("#msgModal").modal("toggle");
        console.log(data);
      });

    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    // $("#bodyinput").val("");
  });

  $(document).on("click", "#get-saved-articles", function () {

    $("#articles").empty();

    document.body.style.cursor = "wait";

    $.getJSON("/articles", function (data) {

      document.body.style.cursor = "default";

      // $(".info-message").html("<h3> " + data.length + " saved articles retrieved!</h3>");
      // $("#msgModal").modal("toggle");

      for (var i = 0; i < data.length; i++) {
        var $articleRow = $("<div>").addClass("row");
        var $articeBoxDiv = $("<div>").addClass("article-box text-left col-md-10 col-md-offset-1");
        var $headerRow = $("<div>").addClass("row saved-article-title");
        // var $linkDiv = $("<div>").addClass("saved-article-title col-md-12");
        var $a = ($("<a>").addClass("article-link col-md-10").attr("href", data[i].link).attr("target", "_blank"));
        var $buttonsDiv = $("<div>").addClass("col-md-2 text-right")
                          .append($("<button>").addClass("btn-success article-notes").text("Notes").data("_id", data[i]._id))
                          .append($("<button>").addClass("btn-danger delete-saved-article").text("Delete").data("_id", data[i]._id));
                          ;
        var $blurbRow = $("<div>").addClass("row");
        var $p = $("<p>").addClass("article-blurb col-md-12").text(data[i].blurb);


        $a.text(data[i].title);
        // $linkDiv.append($a).append($noteButton).append($delButton);
        $headerRow.append($a).append($buttonsDiv);

        $blurbRow.append($p);

        $articeBoxDiv.append($headerRow).append($blurbRow)

        $articleRow.append($articeBoxDiv);
        $("#articles").append($articleRow);
      }
    });

  });

  $(document).on("click", ".delete-saved-article", function () {
    var articleId = $(this).data("_id");

    $.ajax({
      method: "DELETE",
      url: "/articles/" + articleId,
    })
      .done(function (data) {
        // Log the response
        console.log(data);
        $("#get-saved-articles").trigger("click");
        $(".info-message").html("<h3>Article with Id: " + data.id + " was deleted!</h3>");
        $("#msgModal").modal("toggle");
      });

    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    // $("#bodyinput").val("");
  });



});