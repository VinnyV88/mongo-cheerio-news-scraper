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
        var $articleBoxDiv = $("<div>").addClass("article-box text-left col-md-10 col-md-offset-1");
        var $headerRow = $("<div>").addClass("row article-title");
        var $a = ($("<a>").addClass("article-link col-md-11").attr("href", data[i].link).attr("target", "_blank"));
        var $buttonDiv = $("<div>").addClass("col-md-1 text-right")
          .append($("<button>").addClass("btn-danger save-article").text("Save Article").data("title", data[i].title).data("link", data[i].link).data("blurb", data[i].blurb));
        var $blurbRow = $("<div>").addClass("row");
        var $p = $("<p>").addClass("article-blurb col-md-12").text(data[i].blurb);


        $a.text(data[i].title);
        $headerRow.append($a).append($buttonDiv);

        $blurbRow.append($p);

        $articleBoxDiv.append($headerRow).append($blurbRow)

        $articleRow.append($articleBoxDiv);
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

    $(this).parent().addClass("active");
    $(this).parent().siblings().removeClass("active");

    $("#articles").empty();

    document.body.style.cursor = "wait";

    $.getJSON("/articles", function (data) {

      document.body.style.cursor = "default";

      // $(".info-message").html("<h3> " + data.length + " saved articles retrieved!</h3>");
      // $("#msgModal").modal("toggle");

      for (var i = 0; i < data.length; i++) {
        var $articleRow = $("<div>").addClass("row");
        var $articleBoxDiv = $("<div>").addClass("article-box text-left col-md-10 col-md-offset-1");
        var $headerRow = $("<div>").addClass("row saved-article-title");
        var $a = ($("<a>").addClass("article-link col-md-10").attr("href", data[i].link).attr("target", "_blank"));
        var $buttonsDiv = $("<div>").addClass("col-md-2 text-right")
                          .append($("<button>").addClass("btn-success article-notes").text("Notes").data("_id", data[i]._id))
                          .append($("<button>").addClass("btn-danger delete-saved-article").text("Delete").data("_id", data[i]._id));
                          ;
        var $blurbRow = $("<div>").addClass("row");
        var $p = $("<p>").addClass("article-blurb col-md-12").text(data[i].blurb);


        $a.text(data[i].title);
        $headerRow.append($a).append($buttonsDiv);

        $blurbRow.append($p);

        $articleBoxDiv.append($headerRow).append($blurbRow)

        $articleRow.append($articleBoxDiv);
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
  });

  $(document).on("click", ".article-notes", function () {

    var article_id = $(this).data("_id");

    //save the article_id to the save button so that we can retrieve it later for the save
    $("#note-save").data("article_id", article_id);

    $(".notes-well").empty();

    $.getJSON("/notes/" + article_id, function (data) {

      $("#notes-header").html("<span class=\"fa fa-sticky-note-o\" style=\"font-size:24px\"></span> " + data.title)

      for (var i = 0; i < data.notes.length; i++) {
        var $articleNoteRow = $("<div>").addClass("row")
        .attr("style", "margin-right: 0px;margin-left: 0px; margin-bottom: 10px;");
        var $noteBoxDiv = $("<div>").addClass("note-box text-left col-md-12");
        var $headerRow = $("<div>").addClass("row note-title");
        var $title = $("<h4>").addClass("col-md-11").text(data.notes[i].title);
        var $buttonDiv = $("<div>").addClass("col-md-1 text-right")
                          .append($("<button>").addClass("btn-danger delete-note").text("X").data("_id", data.notes[i]._id).data("article_id", article_id));
        var $noteRow = $("<div>").addClass("row");
        var $p = $("<p>").addClass("note-body col-md-12").text(data.notes[i].body);

        $headerRow.append($title).append($buttonDiv);

        $noteRow.append($p);

        $noteBoxDiv.append($headerRow).append($noteRow)

        $articleNoteRow.append($noteBoxDiv);
        $(".notes-well").append($articleNoteRow);
      }
      
      $("#notesModal").modal("toggle");

    });

  });

  $(document).on("click", "#note-save", function () {
    var article_id = $(this).data("article_id");
    var noteTitle = $("#note-title").val();
    var noteBody = $("#note-body").val();
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/note/" + article_id,
      data: {
        title: noteTitle,
        body: noteBody
      }
    })
      .done(function (data) {
        // Log the response
        $("#note-title").val("");
        $("#note-body").val("");
      });

  });

  $(document).on("click", ".delete-note", function () {
    var articleId = $(this).data("article_id");
    var id = $(this).data("_id");

    $.ajax({
      method: "DELETE",
      url: "/note/" + id + "/" + articleId,
    })
      .done(function (data) {
        $("#notesModal").modal("toggle");
      });
  });



});