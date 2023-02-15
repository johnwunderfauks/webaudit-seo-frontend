const { Audit } = require("lighthouse");
const path = require('path');

class Custom404Page extends Audit {
	static get meta() {
		return {
			id: 'custom-404-page',
			title: 'Site is using a custom 404 error page.',
			failureTitle: 'Site is not using a custom 404 error page.',
			description: 'Check if site is using a custom 404 error page.',
			requiredArtifacts: ['URL'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const custom404 = new URL('/404', artifacts.URL.finalUrl).href;
		const response = await fetch(custom404).then(res => res.status).catch(err => console.log(err));

		/**
		* @return {LH.Product}
		*/

		if(response == 404) {
			return {
				score: 0,
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = Custom404Page;