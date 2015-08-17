/**
 *index.js
 *
 **/
var res,req,
	url = require('url'),
	fs = require('fs');
function init(resq,requ){
	res = resq;
	req = requ;
}


function index(){
	var readPath = __dirname + url.parse('/index.html').pathname;
	var page = fs.readFileSync(readPath);
	res.writeHead(200,{'Content-Type':'text/html'});
	res.end(page);
}

exports.init = init;
exports.index = index;
