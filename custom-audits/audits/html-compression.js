const { Audit } = require("lighthouse");
const util = require('util');
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

class HTMLCompression extends Audit {
	static get meta() {
		return {
			id: 'html-compression',
			title: 'Site is using HTML compression.',
			failureTitle: 'Site is not using HTML compression.',
			description: 'Check if your site is using HTML compression.',
			requiredArtifacts: ['devtoolsLogs', 'URL'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const devtoolsLogs = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
		const records = await NetworkRecords.request(devtoolsLogs, context);
		const documentRequest = records.find(record => record.url == artifacts.URL.finalUrl);
		const contentEncoding = documentRequest.responseHeaders.find(header => header.name == 'content-encoding');

		/**
		* @return {LH.Product}
		*/

		if(!contentEncoding) {
			return {
				score: 0,
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = HTMLCompression;