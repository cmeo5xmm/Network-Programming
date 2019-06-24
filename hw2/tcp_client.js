var HOST = '127.0.0.1';
var PORT = 5566;
var net = require('net');
var client = new net.Socket();
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var action={"action" :""};
var c_connect=0;
var c_new=0;
var win=0;

console.log("Welcome to Game 2048!");
console.log("enter 'help' to get more information");

rl.setPrompt('>');
rl.prompt();

rl.on('line', function(line) {
  switch(line.trim()) {
    case 'help':
      console.log('Enter keyboard:');
	  console.log("'connect' - connect to game server");
	  console.log("'disconnect' - disconnect from game server");
	  console.log("'new' - new a game round");
	  console.log("'end' - close the game");
	  console.log("'w' - move bricks up");
	  console.log("'s' - move bricks down");
	  console.log("'a' - move bricks left");
	  console.log("'d' - move bricks right");
	  console.log("'u' - undo the last move");
	  if(c_new==0){
			  rl.setPrompt('>');
			  rl.prompt();
		  }else{
			  rl.setPrompt('move>');
			  rl.prompt();
		  }
      break;
	case 'connect':               /////////////
	  if(c_connect==0){
		 client.connect(PORT, HOST, function() {
			 console.log("connect to game server");
		 });
		 c_connect=1;
		 rl.setPrompt('>');
		 rl.prompt();
	  }else{
		  console.log("Have already connectted to server");
		  if(c_new==0){
			  rl.setPrompt('>');
			  rl.prompt();
		  }else{
			  rl.setPrompt('move>');
			  rl.prompt();
		  }
	  }
	  break;
	case 'new':               ////////////////
	  if(c_connect==1 && c_new==0){
		  action.action='New';
		  client.write(JSON.stringify(action));
		  c_new=1;
	  }else if(c_connect==0){
		  console.log("Please connect to server first");
		  rl.setPrompt('>');
		  rl.prompt();
	  }else{
		  console.log("Have already in a game round");
		  rl.setPrompt('move>');
		  rl.prompt();
	  }
	  break;
	case 'end':
	  if(c_connect==0){
		  console.log("Please connect to server first");
		  rl.setPrompt('>');
		  rl.prompt();
	  }else if(c_new==0){
		  console.log("Please new a game round first");
		  rl.setPrompt('>');
		  rl.prompt();
	  }else{
		  action.action='End';
		  client.write(JSON.stringify(action));
	  }
	  break;
	case 'disconnect':
	  if(c_connect==0){
		  console.log("Please connect to server first");
		  rl.setPrompt('>');
		  rl.prompt();
	  }else{
		  client.end();
		  console.log('disconnect from game server');
		  rl.setPrompt('> ');
		  rl.prompt();
		  c_connect=0;
		  c_new=0;
	  }
	  break;
	case 'whosyourdaddy':
	  if(c_connect==0){
		  console.log("Please connect to server first");
		  rl.setPrompt('>');
		  rl.prompt();
	  }else if(c_new==0){
		  console.log("Please new a game round first");
		  rl.setPrompt('>');
		  rl.prompt();
	  }else{
		  action.action='whosyourdaddy';
		  client.write(JSON.stringify(action));
	  }
	  break;
    default:
	  if(c_connect==0){
		  console.log("Please connect to server first");
		  rl.setPrompt('>');
		  rl.prompt();
		  break;
	  }
	  
	  if(c_new==0){
		  console.log("Please new a game round first");
		  rl.setPrompt('>');
		  rl.prompt();
		  break;
	  }else if(line.trim()=="w"){
			  action.action="moveUp";
			  client.write(JSON.stringify(action));
	  }else if(line.trim()=="s"){
			  action.action="moveDown";
			  client.write(JSON.stringify(action));
	  }else if(line.trim()=="a"){
			  action.action="moveLeft";
			  client.write(JSON.stringify(action));
	  }else if(line.trim()=="d"){
			  action.action="moveRight";
			  client.write(JSON.stringify(action));
	  }else if(line.trim()=="u"){
			  action.action="unDo";
			  client.write(JSON.stringify(action));
	  }else{
			  action.action="123";
			  client.write(JSON.stringify(action));
	  }
		  break;
	  }

});

client.on('data', function (response, remote){
	var re= JSON.parse(response);
	if(re.status==0){
		console.log(re.message);
		if(c_new==0){
			rl.setPrompt('>');
			rl.prompt();
		}else{
			rl.setPrompt('move>');
			rl.prompt();
		}
	}else if(re.message=="The game has closed"){
		console.log("The game has closed");
		c_new=0;
		rl.setPrompt('>');
		rl.prompt();
	}else{
		var x=re.message.split(",");
		for(var i=0;i<16;i++){
			if(x[i]==0) x[i]="    ";
			if(x[i]>0 && x[i]<10) x[i]="   "+x[i];
			if(x[i]>=10 && x[i]<100) x[i]="  "+x[i];
			if(x[i]>=100 && x[i]<1000) x[i]=" "+x[i];
			if(x[i]>=1000 && x[i]<10000) x[i]=x[i];
			if(x[i]==2048) win=1;
		}
		
		console.log("---------------------");
		console.log("|" + x[0] + "|" + x[1] + "|" + x[2] + "|" + x[3] + "|");
		console.log("---------------------");
		console.log("|" + x[4] + "|" + x[5] + "|" + x[6] + "|" + x[7] + "|");
		console.log("---------------------");
		console.log("|" + x[8] + "|" + x[9] + "|" + x[10] + "|" + x[11] + "|");
		console.log("---------------------");
		console.log("|" + x[12] + "|" + x[13] + "|" + x[14] + "|" + x[15] + "|");
		console.log("---------------------");
		
		if(win==1){
			console.log("Congrats!You win the game!");
			console.log("The game has closed");
			c_new=0;
			win=0;
			rl.setPrompt('>');
			rl.prompt();
		}else{
			rl.setPrompt('move>');
			rl.prompt();
		}
	}
});