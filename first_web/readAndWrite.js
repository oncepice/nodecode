/*加载模块*/
var http = require('http'),
	fs = require('fs'),//文件处理模块
	url = require('url'),
	querystring = require('querystring'),//字串处理模块
	//httpParam = require('./http_param'),//
	staticModule = require('./static'),
	jade = require('jade'),//jada模板模块
	socket = require('socket.io');
var BASE_DIR = __dirname,
	filePath = BASE_DIR + '/text.txt';

var app = http.createServer(server).listen(80);
io = socket.listen(app);

function server(req,res){
	res.render = function(temp,opt){
		var str = fs.readFileSync(temp,'utf8');
		var fn = jade.compile(str,{filename:temp,pretty:true});
		var page = fn(opt);
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(page);
	}

	var pathname = decodeURI(url.parse(req.url).pathname);
	console.log(pathname);
	/*初始化httpParam模块*/
	//httpParam.init(req,res);
	if(pathname == './favicon.ico'){
	return;
	}
	/*路由处理*/
	switch(pathname){
		case '/' : defaultIndex(res);
		break;
		case '/index' : defaultIndex(res);
		break;
		default :
			staticModule.getStaticFile(pathname,res);
		break;
	}
}

function defaultIndex(res){
	res.render('./index.jade.html');		
}


/*socket服务*/
io.on('connection',function(socket){
	var message = fs.readFileSync(filePath,'utf8');
	socket.emit('change_from_server',{msg:message});
	socket.on('success',function(data){
		console.log(data.msg);		
	});
	socket.on('data',function(data){
		writeFille(data.msg,function(){
			console.log(data);
			socket.emit('change_from_server',{msg:data.msg});		
		});
	});
});

function writeFille(msg,callback){
	fs.writeFile(filePath,msg,function(err){
		if(err){
			console.log(err);
			throw err;
		}
	})
		callback();	
}









