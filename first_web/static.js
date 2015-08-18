var BASE_DIR = __dirname,
	CONF = BASE_DIR + 'conf/',
	STATIC = BASE_DIR + 'static',
	mmieConf;

var sys = require('util'),
	fs = require('fs'),
	url = require('url'),
	path = require('path');
//mmieConf = getMmieConf();
mmieConf = {
	js:'text/js'
};

function getMmieConf(){
	var routerMsg = {};
	try{
		var str = fs.readFileSync(CONF+'mmie_type.json','utf8');
		routerMsg = JSON.parse(str);
	}catch(e){
		sys.debug('JSON false');	
	}
	return routerMsg
}

exports.getStaticFile = function(pathName,res){
	var extname = path.extname(pathName);
	extname = extname ? extname.slice(1) : '';
	var readPath =BASE_DIR +  pathName;
	var mmieType = mmieConf[extname] ? mmieConf[extname] : 'text/plain';
	
	fs.exists(readPath,function(exists){
		if(!exists){
			res.writeHead(404,{'Content-Type':'text/plain'});
			res.end('url : ' + pathName + ' not find');
		}else{
			fs.readFile(readPath,function(err,file){
				if(err){
					res.writeHead(500,{'Content-Type':'text/plain'});
					res.end(err);
				}else{
					res.writeHead(200,{'Content-Type':mmieType});
					res.write(file,"binary");
					res.end();
				}
			});
		}
	});
}







