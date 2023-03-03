const { Audit } = require("lighthouse");

class SEOFriendlyURL extends Audit {
	static get meta() {
		return {
			id: 'seo-friendly-url',
			title: 'SEO Friendly URL is ideal.',
			failureTitle: 'SEO Friendly URL is NOT ideal.',
			description: 'SEO Friendly URL.',
			requiredArtifacts: ['URL', 'AnchorElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* @param {LH.Audit.Context} context
	*/
	static audit(artifacts, context) {

        // validate special character
        const regex = /[`!@$%^&*()_+\\[\]{};\\|,<>~]/

        let results = []

        if(regex.test(artifacts.URL.requestedUrl)) {
            results.push({
                tagName: "URL",
                node: "",
                textContent: artifacts.URL.requestedUrl
            })
        }

        artifacts.AnchorElements.map(element => {
            if(regex.test(element.href)) {
                results.push(element)
            }
        })
          /** @type {LH.Audit.Details.Table['headings']} */
          const headings = [
            { key: 'tagName', itemType: 'text', text: 'Tag name' },
            { key: 'node', itemType: 'node', text: 'Elements' },
            { key: 'textContent', itemType: 'text', text: 'Content' }
          ];

          if(results.length > 0) {
            return {
                score: 1,
                numericValue: results.length,
				numericUnit: 'SEO Friendly URL',
				displayValue: `${results.length} links`,
				details: Audit.makeTableDetails(headings, results),
            }
          }

		return {
			score: 1,
		};
	}
}

module.exports = SEOFriendlyURL;