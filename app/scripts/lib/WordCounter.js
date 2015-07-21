/*
* @namespace Create namespace for app and lib
*/
var app = app || {};
app.lib = app.lib || {};

/*
* @classdesc Implements a Word counter
*/

app.lib.WordCounter = (function () {
	
	var _text;
	
	var WordCounter = function (text) {
		//Initialize text
		_text = text;	
	}
	
	/*
	* Returns an array of words found in the text & strips out punctuation
	*/
	WordCounter.prototype.getWords = function (text) {
		// Replace special characters with space
		text = text.replace(/:,;—\//, ' ');
		
		// Remove non word characters except &
		text = text.replace(/[^a-zA-Z0-9\s&]/g, '');
		
		// Match any non-spaces
		var words = text.match(/\S+/g);
		
		return words;
	};
	
	/*
	* Returns an array of sentences found in the text
	*/
	WordCounter.prototype.getSentences = function (text) {
		// Match any non-punctuation followed by punctuation
		// TODO: add support for filtering abbreviations
		var sentences = text.match(/[^\.!\?]+[\.!\?]/g);
	
		return sentences;
	};
	
	/*
	* Returns an array of paragraphs found in the text
	*/
	WordCounter.prototype.getParagraphs = function (text) {
		// Match non-new lines followed by any number of new lines followed by non-new lines
		var paragraphs = text.match(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/g);
		
		return paragraphs;		
	};
	
	/*
	* Returns and array of senteces and their words
	*/
	WordCounter.prototype.getSentenceWords = function (text) {
		// Initialize sentence words array
		var sentenceWords = [];
		
		// Grab the sentences
		var sentences = this.getSentences(text);
		
		// Loop over sentences and grab words
		if (sentences) {
			for (var i = 0; i < sentences.length; i++) {
				sentenceWords.push({
					sentence: sentences[i],
					words: this.getWords(sentences[i])
				});
			}	
		}
		
		return sentenceWords;
	};
	
	/*
	* Returns a count for all words in the text
	*/
	WordCounter.prototype.countWords = function () {
		var words = this.getWords(_text);
		return words ? words.length : 0;
	};
	
	/*
	* Returns a count for all sentences in the text
	*/
	WordCounter.prototype.countSentences = function () {
		var sentences = this.getSentences(_text);
		return sentences ? sentences.length : 0;
	};
	
	/*
	* Returns a count for all paragraphs in the text
	*/
	WordCounter.prototype.countParagraphs = function () {
		var paragraphs = this.getParagraphs(_text);
		return paragraphs ? paragraphs.length : 0;
	};
	
	/*
	* Returns an object that has bigram as key e.g 'one of' and number of occurences as value
	* Only returns occurrences that are greater than 1
	*/
	WordCounter.prototype.countBigrams = function () {
		// Initialize bigram maps
		var bigramMap = {};
		var filteredBigramMap = {};
		
		// Get the sentences and their words
		var sentenceWords = this.getSentenceWords(_text);

		// Populate bigram map
		for (var i = 0; i < sentenceWords.length; i++) {
			var words = sentenceWords[i].words;
			
			for (var j = 0; j < words.length - 1; j++) {
				var currentWord = words[j];
				var nextWord = words[j + 1];
				var key = currentWord + ' ' + nextWord;
				
				if (bigramMap[key]) {
					bigramMap[key] += 1;
				} else {
					bigramMap[key] = 1;
				}
			}
		}
		
		// Filter out any bigrams in the map that have 1 entry
		for (var b in bigramMap) {
			if (bigramMap[b] >= 2) {
				filteredBigramMap[b] = bigramMap[b];
			}
		}
		
		return filteredBigramMap;
	};
	
	/*
	* Returns an object that has word length as key and word length occurrence as value
	*/
	WordCounter.prototype.getWordLengthDistribution = function () {
		// Initialize word length map
		var wordLengthMap = {};
		
		// Get all words
		var words = this.getWords(_text);
		
		// Loop through words and populate word distribution
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			var key = word.length;
			
			if (wordLengthMap[key]) {
				wordLengthMap[key] += 1;
			} else {
				wordLengthMap[key] = 1;
			}
		}
		
		return wordLengthMap;
	};
	
	return WordCounter;
})();