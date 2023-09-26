const { Audit } = require("lighthouse");
const fetch = require("node-fetch");

class ServerSignature extends Audit {
  static get meta() {
    return {
      id: "server-signature",
      title: "Server Singature is OFF",
      failureTitle: "Server Singature is ON.",
      requiredArtifacts: ["URL"],
      description: 'Detecting Server Singature on a page.',
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static async audit(artifacts, context) {
    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      { key: "servername", itemType: "text", text: "Server name" },
    ];
    const response = await fetch(artifacts.URL.requestedUrl).then((response) =>
      response.headers.get("server")
    );
    /**
     * @return {LH.Product}
     */

    if (response) {
      return {
        score: 0,
      };
    }
    return {
      score: 1,
    };
  }
}

module.exports = ServerSignature;
