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
   } // Send nothing..
});

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