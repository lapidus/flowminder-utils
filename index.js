'use strict';

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

//
// Middlewear solution
//
// app.use(function(req, res) {
// 	res.sendfile(__dirname + '/public/index.html');
// });

//
// Routing solution
//
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
