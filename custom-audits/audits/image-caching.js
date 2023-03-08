const { Audit } = require("lighthouse");
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

class ImageCaching extends Audit {
	static get meta() {
		return {
			id: 'image-caching',
			title: 'This site is using cache headers for images.',
			failureTitle: 'This site is not using cache headers for images.',
			description: 'Checks if your page is using an image expires tag, which specifies a future expiration date for your images.',
			requiredArtifacts: ['devtoolsLogs'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const devtoolsLogs = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
		const records = await NetworkRecords.request(devtoolsLogs, context);

		const images = records.filter(record => record.statusCode === 200 && record.resourceType === "Image" && record.responseHeaders.find(header => header.name == "cache-control"));

		if(images.length == 0) {
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

module.exports = ImageCaching;