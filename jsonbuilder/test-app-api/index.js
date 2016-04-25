var http = require("http"),
server = http.createServer(),
sql = require("mysql");

/*var mysql = sql.createPool({
	host : '11.50.5.0',
	user : 'yogesh-user',
	password : 'starapp',
	database : 'jsonmaker'
});*/
var mysql = sql.createPool({
	host : '127.0.0.1',
	user : 'root',
	password : 'yogmysql',
	database : 'yogdb'
});
server.on("request",function(req,res){
	//res.setHeader('content-type','application/json');
	res.setHeader('Access-Control-Allow-Origin', "http://localhost");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader("Content-Type", "application/json");
	mysql.query("select * from empinfo", function(err, rec){
		console.log(rec);
		//res.write(JSON.stringify(rec));
		res.end("Connected!");
	});
	//res.end("Hi");
}).listen(8080);