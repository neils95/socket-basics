var name = getQueryVariable('name')||'Anonymous';
var room  =getQueryVariable('room')|| 'Unnamed room';
var socket =io();

console.log(name+'wants to join' +room);
jQuery('.room-title').text(room);

//when connection with socket is established. Client succesfully conects to server
socket.on('connect',function(){
	console.log('Connected to socket io server');
	socket.emit('joinRoom',{
		name:name,
		room:room
	});

	
});

//when socket receives a message from server
socket.on('message',function(message){
	var momentTimestamp=moment.utc(message.timestamp);
	
	var $messages=jQuery('.messages');
	var $message =jQuery('<li class="list-group-item"></li>')

	console.log('New message');
	console.log(message);

	$message.append('<p><strong>'+message.name+' ' +momentTimestamp.local().format('h:mm a')+'</strong></p>')
	$message.append('<p>'+ message.text+'</p>');
	$messages.append($message);
});

// Handling submitting of new message. Start with pund for ids, money sign talks about jquery instance
var $form = jQuery('#message-form');
$form.on('submit',function(event){
	//handle form submission on our own
	event.preventDefault();
	var $message =$form.find('input[name=message]');
	socket.emit('message',{
		name:name,
		text: $message.val()
	});
	$message.val('');
});