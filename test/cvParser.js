var CvParser = require('../lib/cvParser');
var assert = require('assert');

suite('CvParser', function () {
	
	test("parse fileld and values", function() {

		var filelds = ["date of birth", "age"];
		var parser = new CvParser(filelds);
		var text = "date of   Birth : 2010 Aug 10   Age = 40\n";

		parser.parseChunk(text);
		parser.close();

		assert.deepEqual({
			"date of birth": ["2010 Aug 10"],
			"age": ['40']
		}, parser.getResult());
	});

	test("close parsing", function() {

		var filelds = ["date of birth", "age"];
		var parser = new CvParser(filelds);
		var text = "date of   Birth : 2010 Aug 10   Age = 40";

		parser.parseChunk(text);
		parser.close();

		assert.deepEqual({
			"date of birth": ["2010 Aug 10"],
			"age": ['40']
		}, parser.getResult());
	});
});