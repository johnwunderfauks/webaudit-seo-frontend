const { Audit } = require("lighthouse");
const util = require('util');
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');
const dns = require('dns');

class CustomAudit extends Audit {
	static get meta() {
		return {
			id: 'custom-audits',
			title: 'Custom audit test success.',
			failureTitle: 'Custom audit test fail.',
			description: 'Template file to test custom audits.',
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

		var consoleData = spfRecord;

		console.log(util.inspect(consoleData, { showHidden: false, colors: true, depth: null, maxArrayLength: null }));

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
		};
	}
}

module.exports = CustomAudit;