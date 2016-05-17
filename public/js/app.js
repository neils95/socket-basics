var socket =io();

socket.on('connect',function(){
	console.log('Connected to socket io server');
});
socket.on('message',function(message){
	console.log('New message: '+message.text);

	//for class start with .
	jQuery('.messages').append('<p>'+ message.text+'</p>');
});

// Handling submitting of new message. Start with pund for ids, money sign talks about jquery instance
var $form = jQuery('#message-form');
$form.on('submit',function(event){
	//handle form submission on our own
	event.preventDefault();
	var $message =$form.find('input[name=message]');
	socket.emit('message',{
		text: $message.val()
	});
	$message.val('');
});