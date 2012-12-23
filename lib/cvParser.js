function CvParser(_fields) {

	var fields = {};
	if(_fields) {

		_fields.forEach(function (f) {
			fields[f.toLowerCase()] = true;
		});
	}

	var doAction = parseField;
	var result = {};

	this.parseChunk = function (chunk) {
	
		if(chunk) {
			for(var lc=0; lc<chunk.length; lc++) {
				this.parseChar(chunk[lc]);
			}
		}	
	};

	this.parseChar = function nextChar (c) {
		
		doAction(c);
	};

	this.getResult = function getResult () {
		return result;
	};

	this.close = function close () {
		
		if(doAction == parseField) {
			endParseField();
		} else if(doAction == parseValue) {
			endParseValue();
		}
	};

	var _currField = "";
	var _buffer = "";
	var _spaceCount = 0;
	
	function parseField(c) {

		var seperatorFields = {
			"\n": true,
			":": true, 
			"=": true
		};

		if(seperatorFields[c]) {

			endParseField();
		} else if(c == " ") {

			//add only one space
			if(_buffer[_buffer.length -1] != " ") {
				_buffer += " ";
			}
		} else {

			_buffer += c.toLowerCase();
		}

	}

	function endParseField () {
		
		_currField = _buffer.trim();
		
		if(fields[_currField]) {

			if(!result[_currField]) {
				result[_currField] = [];
			}
		}

		_buffer = "";

		doAction = parseValue;
	}

	function parseValue (c) {
		
		if(c == "\n") {

			endParseValue();
		} else if( c == " ") {

			_spaceCount++;
			if(_spaceCount == 1) {
				_buffer += " ";
			} else if (_spaceCount > 2) {
				endParseValue();
			}
		} else {

			_buffer += c;
			_spaceCount = 0;
		}
	}

	function endParseValue () {

		if(result[_currField]) {

			result[_currField].push(_buffer.trim());
		}

		_currField = "";
		_buffer = "";
		_spaceCount = 0;

		doAction = parseField;
	}

}

module.exports = CvParser;


