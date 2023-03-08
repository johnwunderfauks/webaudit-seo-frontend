const { Audit } = require("lighthouse");

class MixedContent extends Audit {
	static get meta() {
		return {
			id: 'mixed-content',
			title: 'All resources on the site are loaded over HTTPS.',
			failureTitle: 'One or more resources on the site are not loaded over HTTPS.',
			description: 'This will check if all resources are loaded over a secure HTTPS connection.',
			requiredArtifacts: ['InspectorIssues'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const mixedContentIssue = artifacts.InspectorIssues.mixedContentIssue;

		if(mixedContentIssue.length > 0) {
			return {
				score: 0,
				details: mixedContentIssue
			}
		}

		/**
		* @return {LH.Product}
		*/

		return {
			score: 1,
		};
	}
}

module.exports = MixedContent;