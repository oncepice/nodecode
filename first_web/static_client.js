var staticModule = require('./static'),
	http = require('http'),
	url = require('url');

http.createServer(function(req,res){
	var pathname = url.parse(req.url).pathname;
	if(pathname == '/favicon.ico'){
		return;
	}else if(pathname == '/index' || pathname == '/'){
		res.end('index');
	}else{
		staticModule.getStaticFile(pathname,res);
	}
}).listen(1337);
