const { Audit } = require("lighthouse");
const google = require("google");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class RelatedKeyword extends Audit {
  static get meta() {
    return {
      id: "related-keyword",
      title: "Related Keyword is ideal.",
      failureTitle: "Related Keyword is NOT ideal.",
      description: "Relatede Keyword.",
      requiredArtifacts: ["HeadElements"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static audit(artifacts, context) {
    let results = [];
    const title = artifacts.HeadElements[0].textContent;

    function myPromise() {
      return new Promise((resolve, reject) => {
        google(title, function (err, res) {
          const dom = new JSDOM(res.body);
          const elements = dom.window.document.querySelectorAll("body .gGQDvd");

          Array.prototype.slice.call(elements).map((ele) => {
            const a = ele.querySelector("a")["href"];

            results.push({
              content: ele.textContent.toLowerCase(),
              link: "www.google.com" + a,
            });
            resolve(results);
          });
        });
      });
    }

    const fetch = async () => {
      const data = await myPromise();
      /** @type {LH.Audit.Details.Table['headings']} */
      const headings = [
        { key: "content", itemType: "text", text: "Content" },
        { key: "link", itemType: "link", text: "Link" },
      ];

      return {
        score: 1,
        numericValue: data.length,
        numericUnit: "related-keyword",
        displayValue: `${data.length} elements`,
        details: Audit.makeTableDetails(headings, data),
      };
    };

    return fetch();
  }
}

module.exports = RelatedKeyword;
