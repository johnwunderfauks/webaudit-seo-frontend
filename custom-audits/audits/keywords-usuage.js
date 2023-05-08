const { Audit } = require("lighthouse");
const pos = require("pos");

class KeywordsUsuage extends Audit {
  static get meta() {
    return {
      id: "keywords-usuage",
      title: "KeywordsUsuage is ideal.",
      failureTitle: "KeywordsUsuage is NOT ideal.",
      description: "KeywordsUsuage.",
      requiredArtifacts: [
        "KeywordsElements",
        "HeadElements",
        "MetaElements",
        "ContentElements",
      ],
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

    const commonKeywords = data
      .filter((keyword) => keyword.count >= 3)
      .slice(0, 5);

    let metaResults = [];

    let metaDescription = artifacts.MetaElements.find(
      (meta) => meta.name == "description"
    );

    const title = artifacts.HeadElements[0];

    const headingFilter = ["h1", "h2", "h3", "h4", "h5", "h6"];

    commonKeywords.map((keyword) => {
      const descriptionFind = metaDescription.content
        .toLowerCase()
        .includes(keyword.name);

      const titleFind = title.textContent.toLowerCase().includes(keyword.name);

      let data = {
        name: keyword.name,
        titleSearch: false,
        descriptionSearch: false,
        headingSearch: false,
      };

      if (descriptionFind) {
        data.descriptionSearch = true;
      } else {
        data.descriptionSearch = false;
      }

      if (titleFind) {
        data.titleSearch = true;
      } else {
        data.titleSearch = false;
      }

      artifacts.ContentElements.map((content) => {
        if (headingFilter.includes(content.tagName.toLowerCase())) {
          const headingFind = content.textContent
            .toLowerCase()
            .includes(keyword.name);

          if (headingFind) {
            data.headingSearch = true;
          } else {
            data.headingSearch = false;
          }
        }
      });
      metaResults.push(data);
    });

    const headings = [
      { key: "name", itemType: "text", text: "name" },
      { key: "titleSearch", itemType: "boolean", text: "titleSearch" },
      {
        key: "descriptionSearch",
        itemType: "boolean",
        text: "descriptionSearch",
      },
      { key: "headingSearch", itemType: "boolean", text: "headingSearch" },
    ];

    return {
      score: 1,
      numericValue: metaResults.length,
      numericUnit: "related-keyword",
      displayValue: `${metaResults.length} elements`,
      details: Audit.makeTableDetails(headings, metaResults),
    };
  }
}

module.exports = KeywordsUsuage;
