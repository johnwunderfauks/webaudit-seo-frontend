const { Audit } = require("lighthouse");
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

class FlashElements extends Audit {
	static get meta() {
		return {
			id: 'flash-elements',
			title: 'This site does not use Flash.',
			failureTitle: 'This site has one or more Flash elements.',
			description: 'Check if your page uses Flash, an outdated technology that was typically used to deliver rich multimedia content.',
			requiredArtifacts: ['devtoolsLogs', 'ObjectElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const devtoolsLogs = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
		const records = await NetworkRecords.request(devtoolsLogs, context);
		const objects = artifacts.ObjectElements;

		const hasFlash = objects.map(object => object.children.map(child => child.attributes.find(attr => attr.value.split('.').pop() == 'swf')));

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