'use strict';

var express = require('express');
var knox = require('knox');
var http = require('http');

var svg2png  = require('svg2png'),
	bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json({limit: '50mb'}));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


//
// Routing solution
//
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});




app.post('/export', function (req, res) {

	var filename = req.body.filename,
		dest = './tmp/' + filename + '.' + req.body.format;

	svg2png(req.body.content, dest, 2, function (err) {
		if (err) {
			res.status(500).send(err);
			console.error(err);
			return;
		}
		console.log("Export success");
		//res.status(201).send('charts/' + filename + '.' + req.body.format);

		console.log("Starting upload");
		var client = knox.createClient({
			key: 'AKIAJAL7LPGM2455FHSA'
			, secret: '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'
			, bucket: 'flowminder-utils'
		});


		var headers = {
			//'Content-Length': pngFile.headers['content-length']
			//, 'Content-Type': pngFile.headers['content-type'],
			'x-amz-acl': 'public-read'
		};

		client.putFile(dest, '/projects/nepal/exports/png/' + filename + '.' + req.body.format, headers, function(err){
			console.log("Uploaded file to S3: ", filename);

			res.status(201).send("OK!");
		})
		
	});
});



function makeID (length) {
	var id = '',
		chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for(var i=0; i < length; i++)
		id += chars.charAt(Math.floor(Math.random() * chars.length));

	return id;
}


app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));

});
