// var inp = `
// Modern NLP algorithms are based on machine learning, especially statistical machine learning. The paradigm of machine learning is different from that of most prior attempts at language processing. Prior implementations of language-processing tasks typically involved the direct hand coding of large sets of rules. The machine-learning paradigm calls instead for using general learning algorithms — often, although not always, grounded in statistical inference — to automatically learn such rules through the analysis of large corpora of typical real-world examples. A corpus (plural, "corpora") is a set of documents (or sometimes, individual sentences) that have been hand-annotated with the correct values to be learned.

// Many different classes of machine learning algorithms have been applied to NLP tasks. These algorithms take as input a large set of "features" that are generated from the input data. Some of the earliest-used algorithms, such as decision trees, produced systems of hard if-then rules similar to the systems of hand-written rules that were then common. Increasingly, however, research has focused on statistical models, which make soft, probabilistic decisions based on attaching real-valued weights to each input feature. Such models have the advantage that they can express the relative certainty of many different possible answers rather than only one, producing more reliable results when such a model is included as a component of a larger system.
// `
// if word ends a sentence
var isLastWord = word => (
  word[word.length-1] === '.' ||
  word[word.length-1] === '\n' && word[word.length-2] === '.'
);
var sample = arr => arr[Math.floor(Math.random() * arr.length)];
var capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

function markov(input, limit) {
  var tokenized = input.split(' ');
  var textLen = tokenized.length;
  limit = limit || textLen;

  var nextWords = {};

  var startingWords = [];

  for (var i = 0; i < textLen - 1; i++) {
    var currentWord = tokenized[i];
    var nextWord = tokenized[i+1];
    var previousWord = i && tokenized[i-1];

    if (currentWord && !previousWord || isLastWord(previousWord)) {
      startingWords.push(currentWord);
    }

    if (nextWords[currentWord]) {
      nextWords[currentWord].push(nextWord);
    }
    else {
      nextWords[currentWord] = [nextWord];
    }
  }

  var output = [capitalize(sample(startingWords))]

  var previousWord;
  for (var i = 1; i < limit; i++) {
    previousWord = output[i-1];
    var nextWord = nextWords[previousWord] && sample(nextWords[previousWord])

    // this one's an edge case; if it encounters the last word in the text
    if (!nextWord) {
      output.push(capitalize(sample(startingWords)))
    }
    // if sentence just ended, start a new sentence
    else if (isLastWord(previousWord)) {
      output.push(capitalize(nextWord));
    }
    else {
      output.push(nextWord);
    }
  }

  // close out last sentence
  while (!isLastWord(previousWord)) {
    var nextWord = sample(nextWords[previousWord])
    output.push(nextWord);
    previousWord = nextWord
  }

  return output.join(' ')
}
