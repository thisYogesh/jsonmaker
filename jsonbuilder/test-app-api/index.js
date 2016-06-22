var http = require("http"),
exp = require("express"),
server = http.createServer(),
sql = require("mysql"),
bodyParser = require('body-parser'),
app = exp();

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//var ucp = app.use(bodyParser.urlencoded({ extended: false }));
/*
	host : '127.0.0.1',
	user : 'root',
	password : 'yogmysql001',
	database : 'yogdb'

	host : '11.50.5.0',
	port : 3306,
	database : 'jsonmakerdb',
	user : 'jsonmakeruser',
	password : 'pWRSqUiJz%S1',
*/
var con = sql.createConnection({
	host : '11.50.5.0',
	port : 3306,
	database : 'jsonmakerdb',
	user : 'jsonmakeruser',
	password : 'admin@123',
});
con.connect(function(err){
	if(err){
		console.log(err);
		return;
	}
	console.log("DB Connected!");
})
app.get("/",function(req, res){
	res.send("hi");
});

app.post("/contactus", function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Content-Type', 'application/json');
	
	var rdata = req.body,
	resp = {},
	query = "insert into contactus(name, email, profession, message) " +
			"values(" +
				"'" + rdata.name + "'," +
				"'" + rdata.email + "'," +
				"'" + rdata.profession + "'," +
				"'" + rdata.reason + "'" +
			")";
	con.query(query, function(err, field){
		console.log(arguments);
		if(err){
			resp = {status : 1, msg : err};
			res.send(JSON.stringify(resp));
			return;
		}
		if(field.affectedRows > 0){
			resp = {status : 0};
			res.send(JSON.stringify(resp));
		}
	})
    //res.send(JSON.stringify(resp));
});

app.listen(process.env.PORT || 8080, function(){
	console.log("you are live at port 8080");
});
/*
var mysql = sql.createPool({
	host : '11.50.5.0:3306',
	user : 'yogesh-user',
	password : 'starapp',
	database : 'jsonmaker'
});

var mysql = sql.createPool({
	host : '127.0.0.1',
	user : 'root',
	password : 'yogmysql',
	database : 'yogdb'
});
server.on("request",function(req,res){
	//res.setHeader('content-type','application/json');
	//res.setHeader('Access-Control-Allow-Origin', "http://localhost");
    //res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	//res.setHeader("Content-Type", "application/json");
	/*mysql.query("select * from contactus", function(err, rec){
		if(err){
			console.log(err);
			res.write(JSON.stringify(err));
		}else{
			console.log(req.url);
			res.write(JSON.stringify(rec));
		}
		res.end("Connected!");
	});
	//res.end("Hi");
}).listen(8080);*/
