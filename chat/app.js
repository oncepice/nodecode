var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	socketIO = require('socket.io');
var server = http.createServer(handle).listen(80,log('start'));

function handle(req,res){
	var path = url.parse(req.url).pathname;
	router(req,res,path);
}

//路由
function router(req,res,path){
	var pointPostion = path.lastIndexOf('.');
	//console.log(pointPostion);
	if(pointPostion > 0){
		//静态资源
		addStatic(res,path,pointPostion);
	}else{
		//非静态
		goIndex(res);	
	}
}

//默认加载
function goIndex(res){
	var readPath = __dirname + '/web/index.html';
	//console.log(readPath);
	fs.exists(readPath,function(exits){
		if(!exits){
			res.writeHead(404,{'Content-Type':'text/plain'});
			res.end('sourse not find');
		}else{
			
			fs.readFile(readPath,function(err,file){
				if(err){
					res.writeHead(500,{'Content-Type':'text/plain'});
					res.end(err);
				}else{
					res.writeHead(200,{'Content-Type':'text/html'});
					res.end(file);
				}		
			})
		}
	})
}

//静态资源加载
function addStatic(res,path,pointPostion){
	var type = ['html','js','css'];
	var extend = path.substring(pointPostion+1);
	//log(extend);
	//log(type.indexOf('css'));
	if(type.indexOf(extend)>= 0){
		var readPath = __dirname + path;
		//console.log(readPath);
		fs.readFile(readPath,function(err,file){
			if(err){
				res.writeHead(404,{'Content-Type':'text/plain'});
				res.end('err: '+err);
			}else{
				res.writeHead(200,{'Content-Type':'text/'+extend});
				res.end(file);
			}
		});
	}else{
		res.writeHead(404,{'Content-Type':'text/plain'});
		res.end('not find!')
	}

};

function log(str){
	console.log(str);
}

//socket

var onlineUsers = {};
var io = socketIO.listen(server);
io.sockets.on('connection',function(socket){
	var uid = socket.id;
	socket.on('message',function(message){
		console.log(message);
		var mdata = JSON.parse(message);
		if(mdata && mdata.EVENT){
			switch(mdata.EVENT){
				case 'login':
					onlineUsers[socket.id] = mdata.value;
					var data = JSON.stringify({
						'uid': uid,
						'user': mdata.value,
						'users': onlineUsers,
						'EVENT': 'login'
					});
					io.sockets.emit('message',data);
				break;
				case 'speack':
					var data = JSON.stringify({
						'uid': uid,
						'content': mdata.value,
						'EVENT': 'speack'
					});
					io.sockets.emit('message',data);
				break;
				case 'logOut':
					delete onlineUsers[socket.id];
					var data = JSON.stringify({
							'EVENT' : 'logOut',
							'uid' : socket.id
						});
					io.sockets.emit('message',data);
				break;
			}
		}
	});	
	socket.on('disconnect', function(){
		console.log(onlineUsers.uid);
		delete onlineUsers[socket.id];
		var data = JSON.stringify({
			'EVENT' : 'logOut',
			'uid' : uid
			});
		io.sockets.emit('message',data);
	});

});


function addUser(newUser){
	onlineUsers[newUser.uid] = newUser.nick;
}

function removeUser(uid){
	onlineUsers.remove(uid);
}








