const { Audit } = require("lighthouse");

class FlashElements extends Audit {
	static get meta() {
		return {
			id: 'flash-elements',
			title: 'This site does not use Flash.',
			failureTitle: 'This site has one or more Flash elements.',
			description: 'Check if your page uses Flash, an outdated technology that was typically used to deliver rich multimedia content.',
			requiredArtifacts: ['EmbeddedContent'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const embeddedContent = artifacts.EmbeddedContent;
		
		const hasFlash = embeddedContent.filter(item => item.type == 'application/x-shockwave-flash' || ( item.src !== null && item.src.split('.').pop() == 'swf') );

		if(hasFlash.length > 0) {
			return {
				score: 0
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

module.exports = FlashElements;