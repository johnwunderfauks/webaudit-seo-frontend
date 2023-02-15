const { Audit } = require("lighthouse");

class Favicon extends Audit {
	static get meta() {
		return {
			id: 'favicon',
			title: 'Favicon is used.',
			failureTitle: 'Favicon is not present.',
			description: 'Check if your site is using and correctly implementing a favicon.',
			requiredArtifacts: ['LinkElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const results = artifacts.LinkElements.filter(link => link.rel.includes('icon'));

		/**
		* @return {LH.Product}
		*/

		if(results.length == 0) {
			return {
				score: 0,
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = Favicon;