const { Audit } = require("lighthouse");
const fsPromises = require("fs").promises;

class CdnUsuage extends Audit {
  static get meta() {
    return {
      id: "cdn-usuage",
      title:
        "This webpage is serving all resources (images, javascript and css) from CDNs!",
      failureTitle:
        "This webpage is not serving all resources (images, javascript and css) from CDNs!",
      description: "CDN usuage.",
      requiredArtifacts: ["CdnUsuage", "URL"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static audit(artifacts, context) {
    // fsPromises.writeFile('CdnUsuage.json', JSON.stringify(artifacts.CdnUsuage))
    // .then( () => { console.log('JSON saved'); })
    // .catch(er => { console.log(er);});

    const regex = new RegExp("(https?://.*?)/");
    const match = regex.exec(artifacts.URL.requestedUrl)[1];

    let isCDN = true;

    for (var i = 0; i < artifacts.CdnUsuage.length; i++) {
      if (artifacts.CdnUsuage[i].src.includes(match)) {
        isCDN = false;
        break;
      }
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      { key: "textContent", itemType: "text", text: "Content" },
    ];

    let content = "";
    if (!isCDN) {
      return {
        score: 0,
      };
    }

    return {
      score: 1,
    };
  }
}

module.exports = CdnUsuage;
