const { Audit } = require("lighthouse");
const path = require('path');

class Sitemap extends Audit {
	static get meta() {
		return {
			id: 'sitemap',
			title: 'Sitemap is present.',
			failureTitle: 'Sitemap is not present.',
			description: 'Check if site has sitemap.',
			requiredArtifacts: ['URL'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const sitemapURL = new URL('/sitemap.xml', artifacts.URL.finalUrl).href;
		const response = await fetch(sitemapURL).then(res => res.status).catch(err => console.log(err));

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

module.exports = Sitemap;