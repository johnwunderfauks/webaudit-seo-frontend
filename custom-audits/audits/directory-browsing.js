const { Audit } = require("lighthouse");

class DirectoryBrowsing extends Audit {
  static get meta() {
    return {
      id: "directory-browsing",
      title: "Directory browsing is disabled for this website.",
      failureTitle: "Directory browsing is enabled for this website.",
      description: "Directory Browsing Test",
      requiredArtifacts: ["URL", "AllHeadingElements"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static async audit(artifacts, context) {
    const currrentURL = new URL(artifacts.URL.requestedUrl).pathname;

    let isEnableDirBrowsing = false;

    for (const heading of Array.prototype.slice.call(
      artifacts.AllHeadingElements
    )) {
      let namePattern = heading.textContent.slice(0, 8).toLowerCase(); // "Index Of"
      let patterns = heading.textContent.substring(9).toLowerCase(); //  "/test/gg"

      if (patterns[patterns.length - 1] != "/") {
        patterns += "/";
      }

      if (
        namePattern === "index of" &&
        patterns === currrentURL.toLowerCase()
      ) {
        isEnableDirBrowsing = true;
        break;
      } else {
        isEnableDirBrowsing = false;
      }
    }

    if (isEnableDirBrowsing) {
      return {
        score: 0,
      };
    }
    return {
      score: 1,
    };
  }
}

module.exports = DirectoryBrowsing;
