const { Audit } = require("lighthouse");
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

class JsCaching extends Audit {
	static get meta() {
		return {
			id: 'js-caching',
			title: 'This site uses caching headers for all JS resources.',
			failureTitle: 'One or more JS resource(s) found not using caching headers.',
			description: 'Checks if your page is using caching headers for all JS resources.',
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

		const jsResources = records.filter(record => record.statusCode === 200 && record.resourceType === "Script" && !record.responseHeaders.find(header => header.name == "cache-control"));

		if(jsResources.length > 0) {
			return {
				score: 0,
				details: jsResources
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

module.exports = JsCaching;