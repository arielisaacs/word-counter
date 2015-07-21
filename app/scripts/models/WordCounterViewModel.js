/*
* @namespace Create namespace for app/models
*/
var app = app || {};
app.models = app.models || {};

/*
* @classdesc Implements a View model for word counter
*/

app.models.WordCounterViewModel = (function () {
	
	var WordCounterViewModel = function () {
		this.wordCount = 0,
		this.sentenceCount = 0,
		this.paragraphCount = 0,
		this.bigrams = [],
		this.wordLengthDist = []
	}
	
	return WordCounterViewModel;
})();