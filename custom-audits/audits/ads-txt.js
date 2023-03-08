const { Audit } = require("lighthouse");

class AdsTxt extends Audit {
	static get meta() {
		return {
			id: 'ads-txt',
			title: 'Site\'s ads.txt file has a valid format.',
			failureTitle: 'Site\'s ads.txt file does not have a valid format.',
			description: 'To check if your website\'s ads.txt file has a valid format.',
			requiredArtifacts: ['AdsTxt'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const adsTxt = artifacts.AdsTxt;
		var invalidLines = [];

		/**
		* @return {LH.Product}
		*/

		if(adsTxt.status != 200) {
			return {
				score: 0,
				explanation: adsTxt.statusText
			};
		}

		if(adsTxt.headers.get('content-type') != 'text/plain') {
			return {
				score: 0,
				explanation: "Content-Type is not 'text/plain', and is therefore invalid."
			};
		}

		/**
		 * format: <FIELD #1>, <FIELD #2>, <FIELD #3>, <FIELD #4>
		 * #1 - The canonical domain name of the system where bidders connect (e.g. google.com)
		 * #2 - The publisher account ID
		 * #3 - The type of account or relationship (e.g. DIRECT or RESELLER)
		 * #4 (optional) - An ID that uniquely identifies the advertising system within a certification authority
		 **/
		adsTxt.content.split(/\r\n|\r|\n/).map(line => {
			const fields = line.split(',');

			const regex = new RegExp(/\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/gm);
			const isDomain = regex.test(fields[0].trim());

			const isPublisherID = fields[1].trim().length >= 1;

			const isAccType = ['DIRECT', 'RESELLER'].includes(fields[2].trim());

			if(!isDomain && !isPublisherID && !isAccType) {
				invalidLines.push(line);
			}
		});

		if(invalidLines.length > 0) {
			return {
				score: 0,
				details: invalidLines
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = AdsTxt;