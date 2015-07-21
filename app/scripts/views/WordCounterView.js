/*
* @namespace Creteat namespace for app/views
*/
var app = app || {};
app.views = app.views || {};

/*
* Implements a view to count words
*/

app.views.WordCounterView = (function ($, Handlebars) {
	
	var $element;
	var viewModel;
	
	/*
	* Converts bigrams to array and sorts by count descending
	* only selects top 5
	*/
	var formatBigrams = function (bigrams) {
		// Convert bigram to array for sorting
		var bigramArray = [];
		var filteredBigramArray = [];
		
		for (var b in bigrams) {
			bigramArray.push({
				bigram: b,
				occurrences: bigrams[b]
			});
		}
		
		// Sort the bigram array by most occurrences first
		bigramArray = bigramArray.sort(function (a, b) {
			return b.occurrences - a.occurrences;
		});
		
		// Filter to only top 5
		for (var i = 0; i < 5; i++) {
			if (bigramArray[i]) {
				filteredBigramArray.push(bigramArray[i]);	
			}
		}
		
		return filteredBigramArray;
	};
	
	/*
	* Converts word length dist to array and adds other fields
	* removes zero percentages
	*/
	var formatWordLengthDist = function (wordLengthDist) {
		var total = 0;
		var wordLengthArray = [];
		var filteredWordLengthArray = [];
		
		// Calculate total
		for (var i in wordLengthDist) {
			total += wordLengthDist[i];
		}
		
		// Add to word length dist array
		for (var i in wordLengthDist) {
			wordLengthArray.push({
				wordLength: i,
				count: wordLengthDist[i],
				percent: parseInt(((wordLengthDist[i] / total ) * 100).toFixed())
			});	
		}
		
		// Filter out zero perctages
		for (var i = 0; i < wordLengthArray.length; i++) {
			if (wordLengthArray[i].percent > 0) {
				filteredWordLengthArray.push(wordLengthArray[i]);
			}
		}
		
		return filteredWordLengthArray;
	};
	
	var WordCounterView = function ($el, vm) {
		
		// Initialize element
		$element = $($el);
		viewModel = vm;
		
		/*
		* Initialize WordCounter handlers
		*/
		this.init = function () {
			var _this = this;
			
			// Bind click to show results
			$element.find('#word-counter-input').on('keyup change', function () {
				_this.countWords();
			});
			
			// Add toggle for panel body
			$element.find('.panel-heading').on('click', function () {
				$element.find('.panel-body').toggle();
			});
			
			// Initial results display
			_this.displayResults(viewModel);
		},
		
		/*
		* Perform word count
		*/
		this.countWords = function () {
			var words = $element.find('#word-counter-input').val();
			var wordCounter = new app.lib.WordCounter(words);
			
			// Update view model
			viewModel.wordCount = wordCounter.countWords(),
			viewModel.sentenceCount = wordCounter.countSentences(),
			viewModel.paragraphCount = wordCounter.countParagraphs(),
			viewModel.bigrams = formatBigrams(wordCounter.countBigrams()),
			viewModel.wordLengthDist = formatWordLengthDist(wordCounter.getWordLengthDistribution())
			
			this.displayResults(viewModel);
		},
		
		/*
		* Display results in the result panel
		*/
		this.displayResults = function (results) {	
			// Bind results
			var $results = $element.find('.words-results'); 
			var source = $("#results-template").html();
			var template = Handlebars.compile(source);
			$results.html(template(results));
		}	
	};
	
	return WordCounterView;
	
})(window.jQuery, window.Handlebars);