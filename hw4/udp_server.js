var HOST = '127.0.0.1';
var PORT = 5566;
var S1 = require('dgram').createSocket('udp4');
var accounts=[];

S1.on('listening', function () {
    var address = this.address();
    console.log('S1 listening on ' + address.address + ":" + address.port);
});

var check = function (account_id){
	if(accounts.length==0) return 1;
	for(var i=0 ; i< accounts.length;i++){
		if(account_id ==  accounts[i].account_id) return false;
	}
	return 1;
};

var getIndex = function (port){
	for(var i=0 ; i< accounts.length;i++){
		if(port ==  accounts[i].socket) return i;
	}
	return -1;
};

var ac_name = function (ac_name){
	for(var i=0 ; i< accounts.length;i++){
		if(ac_name ==  accounts[i].account_name) return i;
	}
	return -1;
};


S1.on('message', function (message, remote) {
	console.log(remote.address + ":" + remote.port +" "+Date());
	var result = {};
	var input= JSON.parse(message);
	if(input.action == "init"){
		
		var c = check(input.account_id);
		if(c==false){
			result.message='account_id has been registered';
		}else{
			accounts.push({"account_name":input.account_name,"account_id": input.account_id,"deposit": 0,"socket": remote.port});
			result.message='ok';
		}
		
	}else if(input.action == "save"){
		
		var n = getIndex(remote.port);
		accounts[n].deposit = accounts[n].deposit + input.money ;
		console.log(accounts[n].deposit);
		result.message='ok';
		
	}else if(input.action == "withdraw"){
		
		var n = getIndex(remote.port);
		if(input.money>accounts[n].deposit){
			result.message='invalid transaction';
		}else{
			accounts[n].deposit = accounts[n].deposit - input.money ;
			console.log(accounts[n].deposit);
			result.message='ok';
		}
		
	}else if(input.action == "remit"){
		
		var n = getIndex(remote.port);
		var dest = ac_name(input.destination_name);
		if(dest == -1 || n==dest || input.money>accounts[n].deposit){
			result.message='invalid transaction';
		}else{
			accounts[n].deposit = accounts[n].deposit - input.money ;
			accounts[dest].deposit = accounts[dest].deposit + input.money ;
			console.log(accounts[n].deposit);
			console.log(accounts[dest].deposit);
			result.message='ok';
		}
		
	}else if(input.action == "show"){
		
		var n = getIndex(remote.port);
		if(n == -1){
			result.message='account not find';
		}else{
			result.message=accounts[n].deposit;
			console.log(accounts[n].deposit);
		}
		
	}else if(input.action == "bomb"){
		
		for(var i=0 ; i< accounts.length;i++){
			accounts[i].deposit = 0;
		}
		result.message='ok';
		
	}else if(input.action == "end"){
		
		accounts = [];
		result.message='end';
		closeAllSockets();
		
	}

	//send response
	message = JSON.stringify(result);
	console.log("S1 send back: "+message);
	S1.send(message, 0, message.length, remote.port, remote.address, function(err) {
		if (err) throw err;
	});	
});

S1.bind(PORT, HOST);