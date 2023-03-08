const { Audit } = require("lighthouse");

class GooglePreview extends Audit {
	static get meta() {
		return {
			id: 'google-preview',
			title: 'Google Preview is ideal.',
			failureTitle: 'Google Preview is NOT ideal.',
			description: 'Google Preview.',
			requiredArtifacts: ['URL', 'HeadElements', 'MetaElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* @param {LH.Audit.Context} context
	*/
	static audit(artifacts, context) {

        const metaDescription = artifacts.MetaElements.find(meta => meta.name === "description") 

        const title = artifacts.HeadElements[0]

        /** @type {LH.Audit.Details.Table['headings']} */
		const headings = [
			{ key: 'type', itemType: 'text', text: 'type' },
			{ key: 'url', itemType: 'text', text: 'url' },
			{ key: 'title', itemType: 'text', text: 'title' },
			{ key: 'description', itemType: 'text', text: 'description' }
		];

        const results = [
            {
                type: "google-preview",
                url: artifacts.URL.requestedUrl,
                title,
                description: metaDescription,
            }
        ]
        return {
            numericValue: results.length,
            numericUnit: 'google-preview',
            displayValue: `${results.length}`,
            details: Audit.makeTableDetails(headings, results),
            score: 0
		};
	}
}

module.exports = GooglePreview;