
"use strict";

// Globals
var $ = jQuery;
var classified_posts = 0;

window.setInterval(function(){
  flagPosts();
}, 4000);



chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	console.log("request received");
 	if (request.action == "getDOM") {
 		content_doc = document;
 		console.log(document.getElementsByTagName("div"));
   		sendResponse({dom: document.getElementsByTagName("div")});
 	} else if (request.action == "getDivs") {
 		console.log("getDivs");
 		var ret_list = findDivsById("thing_");
 		sendResponse(ret_list);
    	sendResponse({});
   	} else if (request.action == "getPosts") {
   		console.log("getPosts request received");
   		flagPosts();
   		sendResponse();
   	}
});

function logAllShares() {
	var post_list = $("div[role='article']");
	var post, title;
	for (var i = 0; i < post_list.length; i++) {
		post = $(post_list[i]);
		title = getPostTitle(post);
		console.log(title);
		if (title.length) {
			console.log($(title).text());
			$(title).html("SlickBits Win Hackathon, Become Billionaires")
			console.log($(post).find("._6mb").text().split("|")[0]);
		}
	}
}


function addOverlay(el) {
	let parent = el.parent();
	let overlay = $("<div></div>");

	// Overlay setup
	let width = el.width();
	let height = el.height();
	overlay.width(width);
	overlay.height(height);
	overlay.css({
		"background-color": "red",
		"z-index": "100"
	});

	el.css({
		"opacity": "0.5"
	});

	// Parent > overlay > el
	overlay.append(el);
	parent.append(overlay);
}

function flagPosts() {
	//Finds all posts, if post is fake, put an overlay on it
	let post_list = $("div[role='article']");
	console.log(post_list);
	console.log(post_list[0]);

	var current_posts = post_list.length;
	// Overlay fake articles
	for ( var i = classified_posts; i < current_posts; i++) {
		var fake_post = $(post_list.get(i));
		if (isPostFake(fake_post)) {
			console.log(fake_post);
			addOverlay(fake_post);
		}
	}
	classified_posts = current_posts;

	//post_list[0].style.display = "none";
	return post_list;
}

function findDivsById(start_substr) {
	var div_list = document.getElementsByTagName("div");
	var ret_list = [];
	for (i = 0; i < div_list.length; i++){
		div = div_list[i];
		if (div && div.getAttribute("id") && div.getAttribute("id").startsWith(start_substr)) {
			ret_list.push(div);
		}
	}
	return ret_list;
}

function isPostFake(post) {
	//Prepare the features
	var post_title = $(post).find('._6m6').text();
	var post_domain = $(post).find("._6mb").text().split("|")[0];
	if (post_title.length && post_domain.length) {
		var post_link = $(post).find("._3ekx");
		var post_url = $(post_link).find('a').attr("onmouseover");
		console.log("Finding URL");
		console.log(post_url);
	}

	//Send get request with features (?)
	if (post_title.length && post_domain.length) {
		if (post_domain.includes("buzzfeed") || post_domain.includes("breitbart")) {
			return true;
		}
	}
	return false;
}