var HOST = '127.0.0.1';
var PORT = 5566;

var client = require('dgram').createSocket('udp4');
var c = require('dgram').createSocket('udp4');

var guess={"guess" : 30000};  //3000~60000
message = JSON.stringify(guess);
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
	console.log("UDP Client listening on " + HOST + ":" + PORT);
	console.log("send" + message);
});

var min=3000;
var max=60000;
client.on('message', function (message, remote) {
	
	try{
		console.log("receive"+ message);
		//input parse
		var check= JSON.parse(message);

		if(check.result=="bingo!"){
			var id={"student_id" : '0216224'};
			mes = JSON.stringify(id);
			c.send(mes, 0, mes.length, guess.guess, HOST, function(err, bytes) {
				if (err) throw err;
				console.log("send" + mes);
			});
			c.on('message', function (message, remote){
				console.log("receive" + message);
			});
			
		}
		if(check.result=="larger"){
			min=guess.guess;
			guess.guess=parseInt((guess.guess+max)/2);
			message = JSON.stringify(guess);
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				console.log("send" + message);
			});
		}
		if(check.result=="smaller"){
			max=guess.guess;
			guess.guess=parseInt((guess.guess+min)/2);
			message = JSON.stringify(guess);
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				console.log("send" + message);
			});
		}
	}
	catch(e){
		guess.guess = 'parse_error: '+e;
	}
});