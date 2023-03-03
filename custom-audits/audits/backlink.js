const { Audit } = require("lighthouse");

class BackLink extends Audit {
	static get meta() {
		return {
			id: 'backlink',
			title: 'BackLink is ideal.',
			failureTitle: 'BackLink is NOT ideal.',
			description: 'BackLink.',
			requiredArtifacts: ['URL', 'AnchorElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* @param {LH.Audit.Context} context
	*/
	static audit(artifacts, context) {

        const getHostnameFromRegex = (url) => {
            // run against regex
            const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            // extract hostname (will be null if no match is found)
            return matches && matches[1];
          }

          const currentWebsiteUrl = getHostnameFromRegex(artifacts.URL.requestedUrl)

          const results = artifacts.AnchorElements.filter(anchor => getHostnameFromRegex(anchor.href) !== currentWebsiteUrl);

          /** @type {LH.Audit.Details.Table['headings']} */
          const headings = [
            { key: 'tagName', itemType: 'text', text: 'Tag name' },
            { key: 'node', itemType: 'node', text: 'Elements' },
            { key: 'textContent', itemType: 'text', text: 'Content' }
          ];

          if(results.length > 0) {
            return {
                score: 0,
                numericValue: results.length,
				numericUnit: 'backlink',
				displayValue: `${results.length} links`,
				details: Audit.makeTableDetails(headings, results),
            }
          }

		return {
			score: 1,
		};
	}
}

module.exports = BackLink;