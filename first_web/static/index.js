var socket = io.connect('http://192.168.2.130');
socket.on('change_from_server',function(data){
	$('textarea').attr('vlaue',data.msg);
	$('#upload').html(data.msg);
});
$(document).ready(function(){
	$('textarea').keyup(function(){
		console.log($('textarea').val());
		socket.emit('data',{msg:$('textarea').val()});		
	})
})
