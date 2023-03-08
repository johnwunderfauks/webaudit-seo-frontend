const { Audit } = require("lighthouse");
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

class PageCache extends Audit {
	static get meta() {
		return {
			id: 'page-cache',
			title: 'This page is serving cached pages.',
			failureTitle: 'This page is not serving cached pages.',
			description: 'Check if your page is serving cached pages.',
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

		const page = records.find(record => record.url == artifacts.URL.finalUrl);
		const cacheHeaders = ['cache-control', 'etag', 'expires'];
		const hasCacheHeader = page.responseHeaders.filter(res => cacheHeaders.includes(res.name));

		if(hasCacheHeader.length == 0) {
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

module.exports = PageCache;