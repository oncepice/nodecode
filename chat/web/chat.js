$(document).ready(function(){
	$('#send').click(function(){
		var message = $.trim($('#message').val());
		if(message.length >0){
			send(message);
			$('#message').val('');
		}
	});
	$("#logout").click(function(event){
		$("#prePage").show();
		$("#mainPage").hide();
		logout();
	});

})

function check(){
	currentUserNick = $.trim($("#nickInput").val());
	if ('' == currentUserNick) {
		alert('请先输入昵称');
		return;
	}

	$("#prePage").hide();
	$("#mainPage").show();
	$('#message').val('');

	doSocket();
}

var users = {},currentUser,socket,con={};

function doSocket(){
	 socket = new io.connect('http://192.168.2.130');
	//链接成功向服务端发送信息
	//遇到一个问题： 点击退出按钮时，如果不刷新页面
	//会出现 链接失败的情况 不会从新链接 我该怎嘛做。。。。
	//暂时只能js刷新页面，还有其他方法吗?........
	con = socket.on('connect',function(){
		socket.emit('message',JSON.stringify({
			'EVENT' : 'login',
			'value' :  $.trim($("#nickInput").val()),
		}));
	});

	console.log(333);

	socket.on('message',function(message){
		var data = JSON.parse(message);
		switch(data.EVENT){
			case 'login':
				users = data.users;
				currentUser = data.uid;
				appendMsg(data.user+'[进入房间]');
				resetUsers();
			break;
			case 'speack':
				var uid = data.uid,
					user = users[uid],
					content = data.content;
				appendMsg(user+':');
				appendMsg("<span>&nbsp;&nbsp;</span>" + content);
			break;
			case 'logOut' :
				var uid = data.uid;
				console.log(users[uid]);
				appendMsg(users[uid] + '[退出了房间]');
				delete users[uid];
				resetUsers();
			break;
		}

	});

	socket.on('error',function(){
		appendMsg('网络出错了...(>_<)"');
	});
	
	socket.on('disconnect',function(){
		//logout();
		appendMsg('disconnect...(>_<)"');
	});

}

function resetUsers(){
	var html = [];
	for(var i in users){
		html.push('<div>'+users[i]+'</div>');			
	}
	$("#onlineUsers").html(html.join(''));
}

//send
function send(message){
	var data = {
		'EVENT' : 'speack',
		'value' : message
	}
	socket.emit('message',JSON.stringify(data));

}

function appendMsg(msg){
	$("#talkFrame").append("<div>" + msg + "</div>");
}

function logout(){
	/*var data = JSON.stringify({
			'EVENT' : 'logOut',
			'value' : currentUser
			});
	socket.emit('message',data);*/
	//socket.close(); //如果不刷新页面 这个方法是否也已起到作用？？
	location.reload();
}




