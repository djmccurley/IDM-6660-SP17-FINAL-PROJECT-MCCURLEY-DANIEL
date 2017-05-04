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
			appendEntry(thisArticle, link);
		}

		if (response[1].length >= 1) {
			endSearch();
		}
	}
	//creates HTML strings for each article element: title, desc and link
	function createEntry(title, description, link) {
		this.articleTitle = "<h2>" + title + "</h2>";
		this.articleDescription = "<p>" + description + "</p>";
		this.articleLink = "<a href='" + link + "' target='_blank'>" + link + "</a>";
	}

	//creates new div, appends all elements for article, appends div to output div
	function appendEntry(thisArticle, link) {
		var newLink = document.createElement("a");
		var newDiv = document.createElement("article");
		newLink.appendChild(newDiv);
		newLink.href = link;
		newLink.target = "_blank";
		newDiv.innerHTML = thisArticle.articleTitle;
		newDiv.innerHTML += thisArticle.articleDescription;
		newDiv.innerHTML += thisArticle.articleLink;

		$("#output_area").append(newLink);
	}	

	function endSearch() {
		var endNotice = document.createElement("a");
		var endText = document.createElement("article");
		endNotice.appendChild(endText);
		endNotice.href = "#";
		endText.innerHTML = "<a href='#'>Back to top</a>"
		$("#output_area").append(endNotice);
	}

	function startSearch() {
		if(inputBox.value) {
			$("main.landing").removeClass("landing").addClass("search");
			/*$(".inputs").slideDown(300);*/ //causing bug when going from desktop to narrower views
			searchWiki();	
		} else {
			inputBox.placeholder = "Please enter a search term";
		}
	}

	//click event no longer needed with form submit working
	//$("#search").click(startSearch());

	/*
		solution to preventing form submit found here:
		http://stackoverflow.com/questions/8082846/form-submit-execute-javascript-best-practice 
	*/

	$(".search_form").on('submit', function() {
		startSearch();
		return false; //need to return false to prevent form submit
	});

	$("#aboutbutton").click(function() {
		$(".about").slideToggle(300);
		$(this).toggleClass("expanded");
	});
});