const { Audit } = require("lighthouse");
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

class CssCaching extends Audit {
	static get meta() {
		return {
			id: 'css-caching',
			title: 'This site uses caching headers for all CSS resources.',
			failureTitle: 'One or more CSS resource(s) found not using caching headers.',
			description: 'Checks if your page is using caching headers for all CSS resources.',
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

		const cssResources = records.filter(record => record.statusCode === 200 && record.resourceType === "Stylesheet" && !record.responseHeaders.find(header => header.name == "cache-control"));

		if(cssResources.length > 0) {
			return {
				score: 0,
				details: cssResources
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

module.exports = CssCaching;