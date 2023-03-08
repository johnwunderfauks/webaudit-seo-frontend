const { Audit } = require("lighthouse");

class MediaQueryResponsive extends Audit {
	static get meta() {
		return {
			id: 'media-query-responsive',
			title: 'Site does implement responsive design functionalities.',
			failureTitle: 'Site does not implement responsive design functionalities.',
			description: 'Check if your page implements responsive design functionalities using the media query technique.',
			requiredArtifacts: ['CSSUsage', 'LinkElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const cssUsage = artifacts.CSSUsage.stylesheets;
		const linkElements = artifacts.LinkElements;

		const cssHasMediaQuery = cssUsage.filter(stylesheet => stylesheet.content.includes('@media'));
		const linkElHasMedaiQuery = linkElements.filter(link => link.node.snippet.includes('media='));

		/**
		* @return {LH.Product}
		*/

		if(cssHasMediaQuery.length == 0 && linkElHasMedaiQuery.length == 0) {
			return {
				score: 0
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = MediaQueryResponsive;