const { Audit } = require("lighthouse");
var google = require("googlethis");

class CompetitorDomain extends Audit {
  static get meta() {
    return {
      id: "competitor-domain",
      title: "Competitor Domain is ideal.",
      failureTitle: "Competitor Domain is NOT ideal.",
      description: "Competitor Domain",
      requiredArtifacts: ["URL"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static audit(artifacts, context) {
    let results = [];

    const options = {
      page: 0,
      safe: false,
      parse_ads: false,
      additional_params: {
        hl: "en",
      },
    };

    function myPromise() {
      return new Promise(async (resolve, reject) => {
        const response = await google.search(
          "related:" + artifacts.URL.requestedUrl,
          options
        );
        response?.results.map((result) => {
          results.push({
            title: result.title,
            link: result.url,
          });
          resolve(results);
        });
      });
    }

    const fetch = async () => {
      const data = await myPromise();

      /** @type {LH.Audit.Details.Table['headings']} */
      const headings = [
        { key: "title", itemType: "text", text: "title" },
        { key: "link", itemType: "link", text: "Link" },
      ];

      return {
        score: 1,
        numericValue: data.length,
        numericUnit: "competitor-domain",
        displayValue: `${data.length} elements`,
        details: Audit.makeTableDetails(headings, data),
      };
    };

    return fetch();
  }
}

module.exports = CompetitorDomain;
