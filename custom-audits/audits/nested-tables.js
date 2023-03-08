const { Audit } = require("lighthouse");

class NestedTables extends Audit {
	static get meta() {
		return {
			id: 'nested-tables',
			title: 'Site contains nested tables.',
			failureTitle: 'Site does not contain nested tables.',
			description: 'Check if this site contains nested tables.',
			requiredArtifacts: ['NestedTableElements'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* * @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const nestedTables = artifacts.NestedTableElements;

		/**
		* @return {LH.Product}
		*/

		if(nestedTables.length > 0) {
			return {
				score: 0,
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = NestedTables;