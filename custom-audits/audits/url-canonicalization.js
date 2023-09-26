const { Audit } = require("lighthouse");

class UrlCanonicalization extends Audit {
  static get meta() {
    return {
      id: "url-canonicalization",
      title: "URL Canonicalization is ideal",
      failureTitle:
        "URL Canonicalization should resolve to the same URL, but currently do not.",
      description: "URL Canonicalization",
      requiredArtifacts: ["URL", "CanonicalElements"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static async audit(artifacts, context) {
    // Get the data / elements collected by the gatherer

    const urlInternal = new URL(artifacts.URL.requestedUrl).href;

    let isCanonical = false;
    const response = artifacts.CanonicalElements.filter(Boolean).map(
      (element) => {
        const elementUrl = new URL(element.href).href;
        if (element?.href) {
          if (elementUrl === urlInternal) {
            isCanonical = true;
          } else {
            isCanonical = false;
          }
        } else {
          isCanonical = false;
        }

        return isCanonical;
      }
    );
    if (isCanonical) {
      return {
        score: 1,
      };
    }
    return {
      score: 0,
    };
  }
}

module.exports = UrlCanonicalization;
