var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app); //start a new server and use express app as boiler plate
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

//global variable where we add all users
var clientInfo = {};

//sends current users to provided socket
function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];		//information of user who sent this request
	var users=[];

	if(typeof info ==='undefined'){
		return;
	}
	
	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo=clientInfo[socketId];
		if(userInfo.room===info.room){
			users.push(userInfo.name);
		}
	});

	socket.emit('message',{
		name:'System',
		text:'Current users: '+users.join(', '),
		timestamp:moment().valueOf()
	});
}

//when connection is established for the first time
io.on('connection', function(socket) {
	console.log('User connected via socket.io!');

	//built in socket.io event to leave room
	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		//check if client exists
		if (typeof userData != undefined) {
			socket.leave(userData.room); //user is disconnected
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	//creating custom event, when someone joins a room
	socket.on('joinRoom', function(req) {

		//socket.io generates identifier. helps us store what user connected as
		clientInfo[socket.id] = req;

		//join is a builting socket method
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + 'has joined!',
			timestamp: moment.valueOf()
		}); //everybody but current socket
	});

	socket.on('message', function(message) {
		console.log(message.timestamp + ': Message receieved: ' + message.text);

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);

		} else {
			//socket.broadcast.emit('message',message);  send it to all except us
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});

	//timestamp property = javascript timestamp
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to to chat application!',
		timestamp: moment.valueOf()
	});
});

http.listen(PORT, function() {
	console.log('Server started');
});