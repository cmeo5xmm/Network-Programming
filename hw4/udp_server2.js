var HOST = '127.0.0.1';
var PORT = 5566;
var S1 = require('dgram').createSocket('udp4');
var accounts=[];
var st=[];

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

var sss = function(){
	for(var i=0 ; i< st.length;i++){
		if(st[i].t < 2 ){
			if(st[i].t == 0 ){
				accounts[i].deposit = accounts[i].deposit + st[i].moneyt ;
				console.log(i+"4564"+accounts[i].deposit+"12316545645"+st[i].moneyt);
				st[i].t = 2;
				st[i].moneyt = 0;
				console.log(accounts[i].deposit);
			}else{
				st[i].t = st[i].t - 1;
			}
			console.log(st[i].t + "45645" + i);
		}
		
		if(st[i].tt < 2 ){
			if(st[i].tt == 0 ){
				accounts[i].deposit = accounts[i].deposit + st[i].moneytt ;
				st[i].tt = 2;
				st[i].moneytt = 0;
				console.log(accounts[i].deposit);
			}else{
				st[i].tt = st[i].tt - 1;
			}
		}
		
		if(st[i].u < 3){
			if(st[i].u == 0 ){
				var de = st[i].v ;
				accounts[de].deposit = accounts[de].deposit + st[i].rm ;
				console.log(accounts[de].deposit);
				st[i].u = 3;
				st[i].v = 0;
				st[i].rm = 0;
			}else{
				st[i].u = st[i].u - 1;
			}
		}
		
		if(st[i].uu < 3){
			if(st[i].uu == 0 ){
				var de = st[i].vv ;
				accounts[de].deposit = accounts[de].deposit + st[i].rmm ;
				console.log(accounts[de].deposit);
				st[i].uu = 3;
				st[i].vv = 0;
				st[i].rmm = 0;
			}else{
				st[i].uu = st[i].uu - 1;
			}
		}
		
		if(st[i].uuu < 3){
			if(st[i].uuu == 0 ){
				var de = st[i].vvv ;
				accounts[de].deposit = accounts[de].deposit + st[i].rmmm ;
				console.log(accounts[de].deposit);
				st[i].uuu = 3;
				st[i].vvv = 0;
				st[i].rmmm = 0;
			}else{
				st[i].uuu = st[i].uuu - 1;
			}
		}
	}
	
	if(st.length!=0 && st[0].bomb < 5 ){
		if(st[0].bomb == 0){
			for(var i=0 ; i< accounts.length;i++){
				accounts[i].deposit = 0;
			}
			st[0].bomb = 5 ;
		}else{
			st[0].bomb = st[0].bomb - 1;
		}
	}
}


S1.on('message', function (message, remote) {
	console.log(remote.address + ":" + remote.port +" "+Date());
	var result = {};
	var input= JSON.parse(message);
	if(input.action == "init"){
		
		sss();
		var c = check(input.account_id);
		if(c==false){
			result.message='account_id has been registered';
		}else{
			accounts.push({"account_name":input.account_name,"account_id": input.account_id,"deposit": 0,"socket": remote.port});
			st.push({"t":2,"tt":2,"moneyt":0,"moneytt":0,"u":3,"uu":3,"uuu":3,"v":0,"vv":0,"vvv":0,"rm":0,"rmm":0,"rmmm":0,"bomb":5});
			result.message='ok';
		}
		
	}else if(input.action == "save"){
		
		sss();
		var n = getIndex(remote.port);
		//accounts[n].deposit = accounts[n].deposit + input.money ;
		//console.log(accounts[n].deposit);
		if(st[n].t == 2){
			st[n].t = st[n].t - 1;
			st[n].moneyt = input.money;
			console.log(st[n].t + "45645" + n + "435" + st[n].moneyt);
		}else{
			st[n].tt = st[n].tt - 1;
			st[n].moneytt = input.money;
		}
		result.message='ok';
		
	}else if(input.action == "withdraw"){
		
		sss();
		var n = getIndex(remote.port);
		if(input.money>accounts[n].deposit){
			result.message='invalid transaction';
		}else{
			accounts[n].deposit = accounts[n].deposit - input.money ;
			console.log(accounts[n].deposit);
			result.message='ok';
		}
		
	}else if(input.action == "remit"){
		
		sss();
		var n = getIndex(remote.port);
		var dest = ac_name(input.destination_name);
		if(dest == -1 || n==dest || input.money>accounts[n].deposit){
			result.message='invalid transaction';
		}else{
			if(st[n].u == 3){
				accounts[n].deposit = accounts[n].deposit - input.money ;
				st[n].u = st[n].u - 1 ;
				st[n].v = dest ;
				st[n].rm = input.money ;
			}else if(st[n].uu == 3){
				accounts[n].deposit = accounts[n].deposit - input.money ;
				st[n].uu = st[n].uu - 1 ;
				st[n].vv = dest ;
				st[n].rmm = input.money ;
			}else if(st[n].uuu == 3){
				accounts[n].deposit = accounts[n].deposit - input.money ;
				st[n].uuu = st[n].uuu - 1 ;
				st[n].vvv = dest ;
				st[n].rmmm = input.money ;
			}
			//accounts[dest].deposit = accounts[dest].deposit + input.money ;
			//console.log(accounts[n].deposit);
			//console.log(accounts[dest].deposit);
			result.message='ok';
		}
		
	}else if(input.action == "show"){
		
		sss();
		var n = getIndex(remote.port);
		if(n == -1){
			result.message='account not find';
		}else{
			result.message=accounts[n].deposit;
			console.log(accounts[n].deposit);
		}
		
	}else if(input.action == "bomb"){
		
		sss();
		st[0].bomb = st[0].bomb - 1 ;
		
		result.message='ok';
		
	}else if(input.action == "end"){
		
		accounts = [];
		st = [];
		console.log(accounts.length);
		result.message='end';
		
	}

	//send response
	message = JSON.stringify(result);
	console.log("S1 send back: "+message);
	S1.send(message, 0, message.length, remote.port, remote.address, function(err) {
		if (err) throw err;
	});	
});

S1.bind(PORT, HOST);