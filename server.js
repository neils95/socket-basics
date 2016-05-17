var PORT =process.env.PORT||3000;
var express =require('express');
var app = express();
var http = require('http').Server(app);//start a new server and use express app as boiler plate
var io =require('socket.io')(http);

app.use(express.static(__dirname+'/public'));

io.on('connection',function(socket){
	console.log('User connected via socket.io!');

	socket.on('message',function(message){
		console.log('Message receieved: '+message.text);
		
		//socket.broadcast.emit('message',message);  send it to all except us
		io.emit('message',message);
	});

	socket.emit('message',{
		text:'Welcome to to chat application!'
	});
});

http.listen(PORT, function(){
	console.log('Server started');
});