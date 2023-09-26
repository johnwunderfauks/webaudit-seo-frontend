const { Audit } = require("lighthouse");
const fetch = require("node-fetch");

class SafeBrowsing extends Audit {
  static get meta() {
    return {
      id: "safe-browsing",
      title:
        "This website is not currently listed as suspicious (no malware or phishing activity found).",
      failureTitle:
        "This website is currently listed as suspicious (malware or phishing activity found).",
      description: "Safe Browsing",
      requiredArtifacts: ["URL"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static async audit(artifacts, context) {
    // Get the data / elements collected by the gatherer

    const BASE_URL =
      "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyCxlxDdRXMfw7hhX2J-k9dBiqijwieRTUY";
    let options = {
      clientId: "safe-browse-url-lookup-webaudit-seo",
      clientVersion: "1.0.0",
    };
    let isUnsafeWebsiteThreatType = [];
    let body = {
      client: {
        clientId: options.clientId,
        clientVersion: options.clientVersion,
      },
      threatInfo: {
        threatTypes: [
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
          "THREAT_TYPE_UNSPECIFIED",
        ],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url: artifacts.URL.requestedUrl }],
      },
    };
    const foundUnsafeWebsite = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => {
        isUnsafeWebsiteThreatType = result.hasOwnProperty("matches")
          ? result.matches.map((m) => {
              return {
                threatType: m.threatType,
              };
            })
          : [];
        if (isUnsafeWebsiteThreatType.length > 0) {
          return true;
        } else {
          return false;
        }
      });
    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      { key: "threatType", itemType: "text", text: "Threat Type" },
    ];

    if (foundUnsafeWebsite) {
      return {
        score: 0,
        details: Audit.makeTableDetails(headings, isUnsafeWebsiteThreatType),
      };
    }
    return {
      score: 1,
    };
  }
}

module.exports = SafeBrowsing;
