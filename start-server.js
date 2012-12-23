var config 		= require('./conf/config.json');
var http 		= require('http');
var fs			= require('fs');
var uuid		= require('node-uuid');
var path		= require('path');
var spawn		= require('child_process').spawn;
var CvParser	= require('./lib/cvParser');
var winstoon	= require('winstoon');
var logger		= winstoon.createLogger('/');

//configure logger
winstoon.add(winstoon.transports.Console);

var app = http.createServer(function(req, res) {

	var name = req.url.replace(/\//g, "");
	var extractFields = getExtractFields(req);
	logger.info('receiving pdf to parse', {name: name, fields: extractFields});

	var outFilename = path.resolve(config['tmp-folder'], uuid.v4() + ".pdf");
	var out = fs.createWriteStream(outFilename);
	req.pipe(out);

	out.on('close', function() {
		
		//after pdf has been saved
		var parser = new CvParser(extractFields);
		var pdf2text = spawn(config.pdftotext, ['-layout', outFilename, '-']);
		
		pdf2text.stdout.on('data', function(chunk) {

			parser.parseChunk(chunk.toString());
		});

		pdf2text.stderr.on('data', function(chunk) {

			logger.error('when spawning pdftotext', {binary: config.pdftotext, error: chunk.toString().trim()});
		});
		
		pdf2text.on('exit', function() {

			logger.info('parsing completed', {name: name});
			parser.close();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(parser.getResult()));
			res.end();
			fs.unlink(outFilename, afterTmpPdfDeleted);
		});
	});

	function afterTmpPdfDeleted(err) {

		if(err) {
			logger.error('error deleteing', { pdf: outFilename, error: err});
		}
	}
});

function getExtractFields (req) {
	
	var strHeader = req.headers['x-extract-fields'];
	if(strHeader) {

		var parts = strHeader.split(',');
		for(var lc=0; lc<parts.length; lc++) {

			parts[lc] = parts[lc].trim();
		}
		return parts;
	} else {

		return [];
	}
}


logger.info('app started in port', {port: config.port});
app.listen(config.port);