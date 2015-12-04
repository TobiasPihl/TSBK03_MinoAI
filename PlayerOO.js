// This is a test
var person = (function() {
	
	var testNumber = 0
	
	return {
		getX: function() {return testNumber},
		setX: function(x) {testNumber = x},
		printRand: function(str) {console.log(str)}
	}
})();