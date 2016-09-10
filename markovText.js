// var inp = `
// Modern NLP algorithms are based on machine learning, especially statistical machine learning. The paradigm of machine learning is different from that of most prior attempts at language processing. Prior implementations of language-processing tasks typically involved the direct hand coding of large sets of rules. The machine-learning paradigm calls instead for using general learning algorithms — often, although not always, grounded in statistical inference — to automatically learn such rules through the analysis of large corpora of typical real-world examples. A corpus (plural, "corpora") is a set of documents (or sometimes, individual sentences) that have been hand-annotated with the correct values to be learned.

// Many different classes of machine learning algorithms have been applied to NLP tasks. These algorithms take as input a large set of "features" that are generated from the input data. Some of the earliest-used algorithms, such as decision trees, produced systems of hard if-then rules similar to the systems of hand-written rules that were then common. Increasingly, however, research has focused on statistical models, which make soft, probabilistic decisions based on attaching real-valued weights to each input feature. Such models have the advantage that they can express the relative certainty of many different possible answers rather than only one, producing more reliable results when such a model is included as a component of a larger system.
// `
// if word ends a sentence
const isLastWord = word => word.trim()[word.length-1] === '.';
const sample = arr => arr[Math.floor(Math.random() * arr.length)];
const capitalize = str => str[0].toUpperCase() + str.slice(1);
const clean = str => str ? str.trim() : '';
const compact = arr => arr.filter(a => !!a);
const breakOn = (text, br) => compact(text.split(br));

function tokenize(text) {
  return breakOn(text, ' ');
}

function parseText(text) {
  const tokens = tokenize(text);
  const breaks = breakOn(text, '\n').length;
  const wordMap = {};
  const startingWords = [];

  tokens.forEach((currentWord, i) => {
    const nextWord     = clean(tokens[i+1]);
    const previousWord = clean(i && tokens[i-1]);
    currentWord        = clean(currentWord);

    if (currentWord && !previousWord || isLastWord(previousWord)) {
      startingWords.push(currentWord);
    }

    if (wordMap[currentWord]) {
      wordMap[currentWord].push(nextWord);
    }
    else if (nextWord) {
      wordMap[currentWord] = [nextWord];
    }
  });

  const data = { wordMap, startingWords, tokens, breaks };
  console.log(data);

  return data;
}
function markov(text, limit) {
  const { wordMap, startingWords, tokens, breaks } = parseText(text);

  limit = limit || tokens.length;

  const output = [capitalize(sample(startingWords))]

  let previousWord;
  for (let i = 1; i < limit; i++) {
    previousWord = output[i-1];
    const nextWord = wordMap[previousWord] && sample(wordMap[previousWord])

    // if it encounters the last word in the text ||
    // if sentence just ended, then start a new sentence
    if (!nextWord || isLastWord(previousWord)) {
      output.push(capitalize(sample(startingWords)));
    }
    else {
      output.push(nextWord);
    }
  }

  // close out last sentence
  while (!isLastWord(previousWord) && wordMap[previousWord]) {
    const nextWord = sample(wordMap[previousWord])
    output.push(nextWord);
    previousWord = nextWord;
  }

  return output.join(' ');
}
