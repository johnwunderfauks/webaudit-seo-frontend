const { Audit } = require("lighthouse");

class CssInline extends Audit {
  static get meta() {
    return {
      id: "css-inline",
      title: "CSSInline is ideal.",
      failureTitle: "CSSInline is NOT ideal.",
      description: "CSSInline.",
      requiredArtifacts: ["CssInlineElements"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static audit(artifacts, context) {
    const results = artifacts.CssInlineElements.filter(Boolean).map(
      (element) => {
        if (element) {
          return {
            node: Audit.makeNodeItem(element.node),
            tagName: element.tagName,
            textContent: element.textContent,
          };
        }
      }
    );

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      { key: "tagName", itemType: "text", text: "Tag name" },
      { key: "node", itemType: "node", text: "Elements" },
      { key: "textContent", itemType: "text", text: "Content" },
    ];

    let countInlineCss = 0;

    artifacts.CssInlineElements.map((element) => {
      if (element) {
        countInlineCss += 1;
      }
    });

    if (countInlineCss > 0) {
      return {
        score: 0,
        numericValue: results.length,
        numericUnit: "inline-css",
        displayValue: `${results.length} elements`,
        details: Audit.makeTableDetails(headings, results),
      };
    }

    return {
      score: 1,
    };
  }
}

module.exports = CssInline;
