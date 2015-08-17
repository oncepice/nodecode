var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	querystring = require('querystring');

/* 创建http服务器*/
http.createServer(server).listen(1337);//.listen(port,ip)

function server(req,res){
	//uri
	var pathName = url.parse(req.url).pathname;
	console.log(req.url);
	//console.log(req.method);
	//console.log(req.headers);
	//路由控制
	
	//不带参数 实例1
	//new router(pathName,res);
	//实例2
	router2(pathName,res,req);
}

//===========================================
//实例2
function router2(pathName,res,req){
	if(pathName == '/favicon.ico'){
		return;
	}
	//截取module 和controller
	var module = pathName.substr(1),
		str = url.parse(req.url).query,
		controller = querystring.parse(str).c,
		classObj = '';
	try{
		if(pathName == './'){
			module = 'index';
		}
		classObj = require('./' + module);
	}catch(err){
		console.log('ERROR：'+ err);
	}
	if(classObj){
		classObj.init(res,req);
		try{
			classObj[controller].call();
		}catch(err){
			console.log('ERROR：'+ err);
			res.writeHead(404,{'Content-Type':'text/plain'});
			res.end('err:'+err);
		}

	}else{
		res.writeHead(404,{'Content-Type':'text/plain'});
		res.end('can not find sourse');
	}
}

//===========================================
//实例1
function router(pathName,res){
	switch(pathName){
		case '/index':
			 render('index',res);
		break;
		case '/img' :
			 render('img',res);
	    break;
		default :
			 render('index',res);
		break;
	}
}

//视图渲染
function render(sourse,res){
	var readPath = '',
		page = '';
	switch(sourse){
		case 'index' :
			readPath = __dirname + '/' + url.parse('index.html').pathname;
			res.writeHead(200,{'Content-Type' : 'text/plain'});
		break;
		case 'img' :
			readPath = __dirname + '/' + url.parse('logo.png').pathname;
			res.writeHead(200,{'Content-Type' : 'image/png'});
		break;
	}
	//资源校验
	__end(readPath,res);
}

//校验资源是否存在
function __end(readPath,res){
	fs.exists(readPath,function(exists){
		if(exists){
			page =fs.readFileSync(readPath);
			res.end(page);
		}else{
			console.log(readPath+'文件不存在！');
			page =  '文件不存在！';	
			res.end(page);
		}
	});
}
//实例1 end
//================================================





