const { Audit } = require("lighthouse");

class DisallowDirective extends Audit {
	static get meta() {
		return {
			id: 'disallow-directive',
			title: 'Robots.txt file does not contain any disallow directives.',
			failureTitle: 'Robots.txt file does contain one or more disallow directives.',
			description: 'Check if your robots.txt file is instructing search engine crawlers to avoid parts of your website.',
			requiredArtifacts: ['RobotsTxt'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const robotsTxt = artifacts.RobotsTxt.content;
		var robotsDisallow = robotsTxt.split(/\r\n|\r|\n/).filter((line) => {
			const directiveName = line.slice(0, line.indexOf(':')).trim().toLowerCase();

			return directiveName == 'disallow';
		});

		/**
		* @return {LH.Product}
		*/

		if(robotsDisallow.length > 0) {
			return {
				score: 0,
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = DisallowDirective;