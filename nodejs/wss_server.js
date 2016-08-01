//= iped nodejs iped-echo example server, ap ruymgaart, www.texansmarthome.com, based on various web examples
//= must have nodejs and 
//= sudo apt-get install nodejs
//= sudo apt-get install npm
//= sudo npm install websocket
//= key and certificate are expected in the same folder. generate as follows:
//= sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout skey.key -out scert.crt
//= if you just want to echo anything, comment out iped stuff

console.log("importing iped");
var iped = require('./iped');

"use strict";
var connectCounter = 0;
var fs = require('fs');
var server = null;

var webSocketServer = require('websocket').server;
var cfg = 
{
    ssl: true,
    port: 3000,
    ssl_key: 'skey.key',
    ssl_cert: 'scert.crt'
};
var httpServ = (cfg.ssl) ? require('https') : require('http');

var processRequest = function(request, response) 
{
	console.log(req);
};

console.log("create server");
if (cfg.ssl) 
{
	server = httpServ.createServer(
	{
		key: fs.readFileSync(cfg.ssl_key),
		cert: fs.readFileSync(cfg.ssl_cert)
	}, processRequest).listen(cfg.port);
} 
else 
{
	server = httpServ.createServer(processRequest);
}
server.listen(cfg.port, function() { });

var wsServer = new webSocketServer( {httpServer: server});

console.log("process iped requests");
wsServer.on('request', function(request) 
{
	var connection = request.accept(null, request.origin);

	connectCounter++; 
	console.log("new connect. connections="+connectCounter.toString());

	connection.on('message', function(message) 
	{
		if (message.type === 'utf8') 
		{
			var echo = ""

			var msgs = iped.qdecode(message.utf8Data);
			for (i = 0; i < msgs.length; i++) 
			{
				echo += iped.encode(msgs[i]) + "*";
			}

			console.log("rx valid iped q of "+msgs.length.toString());
			connection.send(echo);
		}
	});

	connection.on('close', function(connection) 
	{
		connectCounter--;
		console.log("closed connect. connections="+connectCounter.toString()); 
	});
});
//=================================================================
