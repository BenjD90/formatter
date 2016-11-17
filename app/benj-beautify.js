(function() {
	var getNSpaces = function(n) {
		var sArr = [];
		for (; n > 0; n--) {
			sArr[n] = "";
		}
		return sArr.join(" ");
	};


	window.benjbeautify = {
		bean : function(textToFormat) {
			var out = '';
			var deep = 0;
			for(var i = 0; i < textToFormat.length; i++) {
				var letter = textToFormat[i];
				if(letter === '(') {
					deep++;
					out += '(\n' + getNSpaces(deep);
				} else if(letter === ')') {
					deep--;
					out += '\n' + getNSpaces(deep) + ')';
				} else if(letter === ','){
					out += ',\n' + getNSpaces(deep);
				} else if(!letter.match(/\s/)) {
					out += letter;
				}
			}
			return out;
		}
	};
})();
