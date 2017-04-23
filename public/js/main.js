$(document).ready(function() {
	var inputBox = document.getElementById("searchterm");

	//makes ajax request based on settings and input
	function searchWiki() {
		var searchSettings = {
		  "async": true,
		  "crossDomain": true,
		  "dataType": "jsonp",
		  "url": "",
		  "method": "GET",
		  "headers": {
		    'Api-User-Agent': 'Wikipedia Searcher/1.0'
		  }
		}
		//updates settings url based on input in search box
		var urlBase = "https://en.wikipedia.org/w/api.php?action=opensearch&search=";
		var searchTerm = inputBox.value;
		searchSettings["url"] = urlBase + searchTerm;
		console.log(searchSettings["url"]);
	  $.ajax(searchSettings).done(function(response) {
		  //logs response and sends to processEntries to add to DOM
		  console.log(response);
		  $("#output_area").empty();
		  processEntries(response);
		});
	}

	//iterates through response arrays to connect title, desc and link
	function processEntries(response) {
		for (i=0; i<response[1].length; i++) {
			var title = response[1][i];
			var description = response[2][i];
			var link = response[3][i];
			//creates new object with current article title, desc and link
			var thisArticle = new createEntry(title, description, link);
			//passes current article object to be added to DIV
			appendEntry(thisArticle);
		}
	}
	//creates HTML strings for each article element: title, desc and link
	function createEntry(title, description, link) {
		this.articleTitle = "<h2>" + title + "</h2>";
		this.articleDescription = "<p>" + description + "</p>";
		this.articleLink = "<a href='" + link + "' target='_blank'>" + link + "</a>";
	}

	//creates new div, appends all elements for article, appends div to output div
	function appendEntry(thisArticle) {
		var newDiv = document.createElement("article");
		newDiv.innerHTML = thisArticle.articleTitle;
		newDiv.innerHTML += thisArticle.articleDescription;
		newDiv.innerHTML += thisArticle.articleLink;

		$("#output_area").append(newDiv);

	}	
	$("#search").click(function() {
		if(inputBox.value) {
			$("main.landing").removeClass("landing").addClass("search");
			$(".inputs").slideDown(300);
			searchWiki();	
		} else {
			inputBox.placeholder = "Please enter a search term";
		}
	});

	$("#aboutbutton").click(function() {
		$(".about").slideToggle(300);
	});
});