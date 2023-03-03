const { Audit } = require("lighthouse");

class SocialTags extends Audit {
  static get meta() {
    return {
      id: "social-tags",
      title: "SocialTags is ideal.",
      failureTitle: "SocialTags is NOT ideal.",
      description: "SocialTags.",
      requiredArtifacts: ["SocialElements"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static audit(artifacts, context) {
    const elementSummaries = artifacts.SocialElements;

    if (artifacts.SocialElements.join(",").replace(/,/g, "").length === 0) {
      return {
        score: 0,
      };
    }

    const results = elementSummaries.map((element) => {
      if (element) {
        return {
          node: Audit.makeNodeItem(element.node),
          tagName: element.tagName,
          textContent: element.textContent,
        };
      }
    });

    let socialObjBool = {
      type: false,
      url: false,
      site_name: false,
      image: false,
      title: false,
      description: false,
    };

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      { key: "tagName", itemType: "text", text: "Tag name" },
      { key: "node", itemType: "node", text: "Elements" },
      { key: "textContent", itemType: "text", text: "Content" },
    ];

    return {
      score: Number(results.length > 0), // Number between 0 and 1
      numericValue: results.length,
      numericUnit: "element",
      displayValue: `${results.length} elements`,
      details: Audit.makeTableDetails(headings, results),
    };
  }
}

module.exports = SocialTags;
