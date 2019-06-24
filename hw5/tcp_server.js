var HOST = '127.0.0.1';
var PORT = 5566;

var net = require('net');
var S1 = net.createServer();
var number_user = 0;
var user=[];
var mails=[];

S1.listen(PORT, HOST);
console.log('TCP server listening on ' + HOST + ":" +PORT);

var getIndexbyPort = function(port){
	for(var i=0;i<user.length;i++)
		if(port == user[i].client) return i;
	return -1;
}
var checkAcname = function(ac){
	for(var i=0;i<user.length;i++)
		if(ac == user[i].ac_name) return i;
	return -1;
}
var dul = function(socket){
	for(var i=0;i<user.length;i++)
		if(socket == user[i].client) return -1;
	return i;
}
var numberofmail = function(acadd){
	var n=0;
	for(var i=0;i<mails.length;i++)
		if(acadd == mails[i].receiveradd && mails[i].del == 1) n++;
	return n;
}
var findmail = function(ac,num){
	var x=0;
	for(var i=0;i<mails.length;i++){
		if(ac == mails[i].receiver && mails[i].del == 1){
			x++;
			if(x==num){
				return i;
			}
		}
	}
	if(x<num){
		return -1;
	}
}
var time = function(date){

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}
S1.on('connection',  function(socket) {
	
	console.log("connect "+socket.remoteAddress+":"+socket.remotePort+" "+Date());
	
	socket.on('data', function(message){
		var end = 1;
		var result = '';
		var input=[];
		var index=0;
		for(var s = 0;s < message.toString().split(/\s+/).length;s++){
			if(message.toString().split(/\s+/)[s] != ''){
				input[index] = message.toString().split(/\s+/)[s];
				index++;
			}
		}
		console.log("S1 receive:" + message);
		if(input[0] == "init" && input[1] == "-u"){
			
			var reg = new RegExp('"',"g");  
			var acn = input[2].replace(reg, "");  
			var checka = checkAcname(acn);
			var d = dul(socket.remotePort);
			
			if(input.length>3){
				result = "args error\n";
			}else if(checka == -1 && d != -1){
				var pat = new RegExp("[^A-Za-z0-9-_]","g");
				if(pat.test(acn)){
					result = "args error\n";
				}else{
					user.push({"client":socket.remotePort,"ac_name":acn,"del":1,"address":acn+"@nctu.edu.tw"});
					result = acn + "@nctu.edu.tw\n";
				}
			}else if(d == -1){
				result = "args error\n";
			}else{
				result = "This account has been registered\n";
			}
			
			
		}else if(input[0] == "ls"){
			
			var checkn = getIndexbyPort(socket.remotePort);
			if(input.length > 2){
				result = "args error\n";
			}else if(input[1] == "-u"){
				if(user.length == 0){
					result = "no accounts\n";
					console.log(result);
				}else{
					for(var i=0;i<user.length;i++){
						if(user[i].del == 1){
							result=result+user[i].ac_name+"@nctu.edu.tw\n";
							z=0;
						}
					}
					console.log(result);
				}
			}else if(checkn == -1){
				result = "init first\n";
			}else if(input[1] == "-l"){
				var index = 1;
				for(var i=0;i<mails.length;i++){
					if(mails[i].receiver == user[checkn].ac_name && mails[i].del == 1){
						if(mails[i].check == 1){
							result = result + index + "." +mails[i].title +"(new)\n";
						}else{
							result = result + index + "." +mails[i].title +"\n";
						}
						index++;
					}
				}
				if(index == 1){
					result = "no mail\n";
				}
			}else if(input[1] == "-a"){
				var number = numberofmail(user[checkn].address);
				console.log(number);
				result = "Account:"+user[checkn].ac_name+"\nMail address:"+user[checkn].ac_name+"@nctu.edu.tw\nNumber of mails:"+number+"\n";
			}else{
				result = "option error\n";
			}
			
		}else if(input[0] == "rm"){
			
			var check = getIndexbyPort(socket.remotePort);
			if(check == -1){
				result = "init first\n";
			}else if(input[1] == "-d"){
				var c = isNaN(input[2]);
				var n=1;
				if(c || input.length > 3){
					result = "args error\n";
				}else{
					for(var i=0;i<mails.length;i++){
						if(mails[i].receiver == user[check].ac_name){
							if(input[2] == mails[i].n){
								mails[i].del = 0;
								n=0;
								result = "done\n";
							}
						}
					}
					if(n==1){
						result = "args error\n";
					}
				}
			}else if(input[1] == "-D"){
				if(input.length > 2){
					result = "args error\n";
				}else{
					for(var i=0;i<mails.length;i++){
						if(mails[i].receiver == user[check].ac_name){
							mails[i].del = 0;
						}
					}
					result = "done\n";
				}
			}else{
				result = "option error\n";
			}
			
		}else if(input[0] == "rd"){
			
			var check = getIndexbyPort(socket.remotePort);
			if(check == -1){
				result = "init first\n";
			}else if(input.length > 3){
				result = "args error\n";
			}else if(input[1] == "-r"){
				var c = isNaN(input[2]);
				var f = findmail(user[check].ac_name,input[2]);
				if(c || f == -1){
					result = "args error\n";
					console.log(f);
				}else{
					result = "From:"+mails[f].sender+"\nTo:"+mails[f].receiveradd+"\nDate:"+mails[f].date+"\nTitle:"+mails[f].title+"\nContent:"+mails[f].content+"\n";
					mails[f].check=0;
				}
			}else{
				result = "option error\n";
			}
			
		}else if(input[0] == "wt"){
			
			var check = getIndexbyPort(socket.remotePort);
			if(check == -1){
				result = "init first\n";
			}else if(input.length > 7){
				result = "option error\n";
			}else if(input[1] == "-d" ){
				if(input[3] == "-t"){
					if (input[5] != "-c"){
						result = "option error\n";
					}else{
						var pat = new RegExp("[^A-Za-z0-9-_:.@]","g");
						if(pat.test(input[2]) || pat.test(input[4]) || pat.test(input[6])){
							result = "args error\n";
						}else{
							var d =new Date();
							var date = time(d);
							var num = numberofmail(input[2])+1;
							console.log(num);
							var u=1;
							for(var i=0;i<user.length;i++){
								if(user[i].address == input[2] && user[i].del == 1){
									var acc = user[i].ac_name;
									u=0;									}
							}
							if(u==1){
								result = "args error\n";
							}else{
								mails.push({"receiveradd":input[2],"receiver":acc,"title":input[4],"content":input[6],"sender":user[check].address,"date":date,"n":num,"check":1,"del":1});
								result = "done\n";
							}
						}
					}
				}else if(input[3] == "-c"){
					if (input[5] != "-t"){
						result = "option error\n";
					}else{
						var pat = new RegExp("[^A-Za-z0-9-_:.@]","g");
						if(pat.test(input[2]) || pat.test(input[4]) || pat.test(input[6])){
							result = "args error\n";
						}else{
							var d =new Date();
							var date = time(d);
							var num = numberofmail(input[2])+1;
							console.log(num);
							var u=1;
							for(var i=0;i<user.length;i++){
								if(user[i].address == input[2] && user[i].del == 1){
									var acc = user[i].ac_name;
									u=0;									}
							}
							if(u==1){
								result = "args error\n";
							}else{
								mails.push({"receiveradd":input[2],"receiver":acc,"title":input[6],"content":input[4],"sender":user[check].address,"date":date,"n":num,"check":1,"del":1});
								result = "done\n";
							}
						}
					}
				}else{
					result = "option error\n";
				}
			}else if(input[1] == "-t"){
				if(input[3] == "-d"){
					if (input[5] != "-c"){
						result = "option error\n";
					}else{
						var pat = new RegExp("[^A-Za-z0-9-_:.@]","g");
						if(pat.test(input[2]) || pat.test(input[4]) || pat.test(input[6])){
							result = "args error\n";
						}else{
							var d =new Date();
							var date = time(d);
							var num = numberofmail(input[4])+1;
							console.log(num);
							var u=1;
							for(var i=0;i<user.length;i++){
								if(user[i].address == input[4] && user[i].del == 1){
									var acc = user[i].ac_name;
									u=0;									}
							}
							if(u==1){
								result = "args error\n";
							}else{
								mails.push({"receiveradd":input[4],"receiver":acc,"title":input[2],"content":input[6],"sender":user[check].address,"date":date,"n":num,"check":1,"del":1});
								result = "done\n";
							}
						}
					}
				}else if(input[3] == "-c"){
					if (input[5] != "-d"){
						result = "option error\n";
					}else{
						var pat = new RegExp("[^A-Za-z0-9-_:.@]","g");
						if(pat.test(input[2]) || pat.test(input[4]) || pat.test(input[6])){
							result = "args error\n";
						}else{
							var d =new Date();
							var date = time(d);
							var num = numberofmail(input[6])+1;
							console.log(num);
							var u=1;
							for(var i=0;i<user.length;i++){
								if(user[i].address == input[6] && user[i].del == 1){
									var acc = user[i].ac_name;
									u=0;									}
							}
							if(u==1){
								result = "args error\n";
							}else{
								mails.push({"receiveradd":input[6],"receiver":acc,"title":input[2],"content":input[4],"sender":user[check].address,"date":date,"n":num,"check":1,"del":1});
								result = "done\n";
							}
						}
					}
				}else{
					result = "option error\n";
				}
			}else if(input[1] == "-c"){
				if(input[3] == "-d"){
					if (input[5] != "-t"){
						result = "option error\n";
					}else{
						var pat = new RegExp("[^A-Za-z0-9-_:.@]","g");
						if(pat.test(input[2]) || pat.test(input[4]) || pat.test(input[6])){
							result = "args error\n";
						}else{
							var d =new Date();
							var date = time(d);
							var num = numberofmail(input[4])+1;
							console.log(num);
							var u=1;
							for(var i=0;i<user.length;i++){
								if(user[i].address == input[4] && user[i].del == 1){
									var acc = user[i].ac_name;
									u=0;									}
							}
							if(u==1){
								result = "args error\n";
							}else{
								mails.push({"receiveradd":input[4],"receiver":acc,"title":input[6],"content":input[2],"sender":user[check].address,"date":date,"n":num,"check":1,"del":1});
								result = "done\n";
							}
						}
					}
				}else if(input[3] == "-t"){
					if (input[5] != "-d"){
						result = "option error\n";
					}else{
						var pat = new RegExp("[^A-Za-z0-9-_:.@]","g");
						if(pat.test(input[2]) || pat.test(input[4]) || pat.test(input[6])){
							result = "args error\n";
						}else{
							var d =new Date();
							var date = time(d);
							var num = numberofmail(input[6])+1;
							console.log(num);
							var u=1;
							for(var i=0;i<user.length;i++){
								if(user[i].address == input[6] && user[i].del == 1){
									var acc = user[i].ac_name;
									u=0;									}
							}
							if(u==1){
								result = "args error\n";
							}else{
								mails.push({"receiveradd":input[6],"receiver":acc,"title":input[4],"content":input[2],"sender":user[check].address,"date":date,"n":num,"check":1,"del":1});
								result = "done\n";
							}
						}
					}
				}else{
					result = "option error\n";
				}
			}else{
				result = "option error\n";
			}
			
		}else if(input[0] == "exit"){
			
			end=0;
			var checke = getIndexbyPort(socket.remotePort);
			if(checke == -1){
				result = "exit\n";
			}else{
				var x=0;
				user[checke].del = 0;
				for(var i=0;i<user.length;i++){
					if(user[i].del==0) x++;
				}
				result = "exit\n";
			}
			if(x == user.length){
				user=[];
				mails=[];
				socket.write(result);
				socket.end();
			}else{
				socket.write(result);
				socket.end();
			}
			
		}else{
			result = "command error\n";
		}
		
		if(end == 1){
			socket.write(result);
		}
	});
});