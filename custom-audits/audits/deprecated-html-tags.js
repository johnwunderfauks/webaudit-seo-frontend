const { Audit } = require("lighthouse");

class DeprecatedHTML extends Audit {
	static get meta() {
		return {
			id: 'deprecated-html-tags',
			title: 'DeprecatedHTML is ideal.',
			failureTitle: 'DeprecatedHTML is NOT ideal.',
			description: 'DeprecatedHTML.',
			requiredArtifacts: ['DeprecatedHTMLElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* @param {LH.Audit.Context} context
	*/
	static audit(artifacts, context) {

		const results = artifacts.DeprecatedHTMLElements
		
		const headings = [
			{ key: 'tagName', itemType: 'text', text: 'Tag name' },
			{ key: 'node', itemType: 'node', text: 'Elements' },
			{ key: 'textContent', itemType: 'text', text: 'Content' }
		];

		if(results.length > 0) {
			return {
				score: 0,
				numericValue: results.length,
				numericUnit: 'deprecated-html-tags',
				displayValue: `${results.length} deprecated html tags`,
				details: Audit.makeTableDetails(headings, results),

			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = DeprecatedHTML;