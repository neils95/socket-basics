var PORT =process.env.PORT||3000;
var express =require('express');
var app = express();
var http = require('http').Server(app);//start a new server and use express app as boiler plate
var io =require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

io.on('connection',function(socket){
	console.log('User connected via socket.io!');

	socket.on('message',function(message){
		console.log(message.timestamp+': Message receieved: '+message.text);
		
		//socket.broadcast.emit('message',message);  send it to all except us
		message.timestamp=moment().valueOf();
		io.emit('message',message);
	});

	//timestamp property = javascript timestamp
	socket.emit('message',{
		name:'System',
		text:'Welcome to to chat application!',
		timestamp:moment.valueOf()
	});
});

http.listen(PORT, function(){
	console.log('Server started');
});