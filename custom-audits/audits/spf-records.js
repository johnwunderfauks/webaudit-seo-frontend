const { Audit } = require("lighthouse");
const dns = require('dns');

class SPFRecords extends Audit {
	static get meta() {
		return {
			id: 'spf-records',
			title: 'An SPF record is present in your DNS records.',
			failureTitle: 'An SPF record is not present in your DNS records.',
			description: 'Check if your DNS records contains an SPF record.',
			requiredArtifacts: ['URL'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		var hostname = new URL(artifacts.URL.finalUrl).hostname;
		hostname = hostname.startsWith('www.') ? hostname.replace('www.', '') : hostname;

		const txtRecords = await dns.promises.resolveTxt(hostname).then(records => records.flat());
		const spfRecord = txtRecords.filter(record => record.includes('v=spf1'));

		if(spfRecord.length == 0) {
			return {
				score: 0,
			}
		}
		
		/**
		* @return {LH.Product}
		*/

		return {
			score: 1,
			details: spfRecord
		};
	}
}

module.exports = SPFRecords;