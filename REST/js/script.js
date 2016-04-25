//
var app = angular.module("myapp",["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider.when("/",{
		controller : "task as ts",
		templateUrl: "temp1.html"
	});
});
app.controller("task", function(){
	this.name = "yogesh";
});