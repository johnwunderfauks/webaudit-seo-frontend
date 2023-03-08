const { Gatherer } = require("lighthouse");
const pageFunctions = require('lighthouse/lighthouse-core/lib/page-functions');

class FramesetElements extends Gatherer {
	/**
	* @param {LH.Gatherer.PassContext} options
	* @param {LH.Gatherer.LoadData} loadData
	*/
	async afterPass(options, loadData) {
		const driver = options.driver;

		const mainFn = () => {
			// The tag names of the non-interactive elements which we'll check
			const elements = getElementsInDocument('frameset');

			const elementSummaries = elements.map(element => ({
				// getNodeDetails is put into scope via the "deps" array
				node: getNodeDetails(element),
				textContent: element.textContent
			}));

			/**
			* @return {LH.Gatherer.PhaseResult}
			*/
			return elementSummaries;
		}

		return driver.executionContext.evaluate(mainFn, {
			args: [],
			deps: [
				pageFunctions.getElementsInDocumentString,
				pageFunctions.getElementsInDocument,
				pageFunctions.getNodeDetailsString,
			]
		});
	}
}

module.exports = FramesetElements;