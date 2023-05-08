const { Audit } = require("lighthouse");
const pos = require("pos");

class KeywordsCloud extends Audit {
  static get meta() {
    return {
      id: "keywords-cloud",
      title: "KeywordsCloud is ideal.",
      failureTitle: "KeywordsCloud is NOT ideal.",
      description: "KeywordsCloud.",
      requiredArtifacts: ["KeywordsElements"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static audit(artifacts, context) {
    // Tags Filter Docs  https://www.npmjs.com/package/pos/#:~:text=TAGS:
    
    let tagsFilter = [
      "JJ",
      "NN",
      "NNP",
      "NNPS",
      "NNS",
      "RB",
      "RBR",
      "RBS",
      "VB",
      "VBD",
      "VBG",
      "VBP",
      "VBZ",
    ];

    let filtersWords = [
      "am",
      "is",
      "are",
      "was",
      "were",
      "has",
      "have",
      "had",
      "do",
      "does",
      "did",
      "done",
    ];

    // Filter most common five keywords

    const data = [];
    artifacts.KeywordsElements.map((item) => {
      let wrapPos = new pos.Lexer().lex(item.name);

      const tagger = new pos.Tagger();
      const taggedWords = tagger.tag(wrapPos);
      for (let i in taggedWords) {
        const taggedWord = taggedWords[i];
        const word = taggedWord[0];
        const tag = taggedWord[1];
        if (tagsFilter.includes(tag) && !filtersWords.includes(word)) {
          data.push(item);
        }
      }
    });

    const results = data.filter((keyword) => keyword.count >= 3);

    const headings = [
      { key: "name", itemType: "text", text: "name" },
      { key: "count", itemType: "text", text: "count" },
    ];

    if (results.length === 0) {
      return {
        score: 1,
      };
    }

    return {
      score: 1,
      numericValue: results.length,
      numericUnit: "keywords-cloud",
      displayValue: `${results.length} elements`,
      details: Audit.makeTableDetails(headings, results),
    };
  }
}

module.exports = KeywordsCloud;
