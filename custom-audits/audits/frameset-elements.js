const { Audit } = require("lighthouse");

class FramesetElements extends Audit {
	static get meta() {
		return {
			id: 'frameset-elements',
			title: 'Site is not using frames.',
			failureTitle: 'Site is using frames.',
			description: 'Check if your page is using frames.',
			requiredArtifacts: ['FramesetElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const framesetElements = artifacts.FramesetElements;

		/**
		* @return {LH.Product}
		*/

		if(framesetElements.length > 0) {
			return {
				score: 0,
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = FramesetElements;