var socket =io();

socket.on('connect',function(){
	console.log('Connected to socket io server');
});

socket.on('message',function(message){
	var momentTimestamp=moment.utc(message.timestamp);
	console.log('New message');
	console.log(message);

	jQuery('.messages').append('<p><strong>'+ momentTimestamp.local().format('h:mm a')+'</strong>: '+message.text+'</p>');
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