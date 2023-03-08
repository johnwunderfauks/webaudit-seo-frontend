const { Gatherer } = require("lighthouse");
const pageFunctions = require('lighthouse/lighthouse-core/lib/page-functions');

class ObjectElements extends Gatherer {
	/**
	* @param {LH.Gatherer.PassContext} options
	* @param {LH.Gatherer.LoadData} loadData
	*/
	async afterPass(options, loadData) {
		const driver = options.driver;

		const mainFn = () => {
			// The tag names of the non-interactive elements which we'll check
			// const elements = getElementsInDocument('object');

			// const elementSummaries = elements.map(element => {
			// 	return {
			// 		// getNodeDetails is put into scope via the "deps" array
			// 		node: getNodeDetails(element)
			// 	}
			// });

			const elements = getElementsInDocument('object');
			const elementSummaries = elements.map(element => {
				const childNodes = Array.from(element.children).map(child => ({
					tagName: child.tagName,
					node: getNodeDetails(child),
					attributes: Array.from(child.attributes).map(attr => ({
						name: attr.name,
						value: attr.value
					}))
				}))
				return {
					// getNodeDetails is put into scope via the "deps" array
					tagName: element.tagName,
					node: getNodeDetails(element),
					attributes: Array.from(element.attributes).map(attr => ({
						name: attr.name,
						value: attr.value
					})),
					children: childNodes
				}
			});

			/**
			* @return {LH.Gatherer.PhaseResult}
			*/
			return elementSummaries;
		}

		return driver.executionContext.evaluate(mainFn, {
			args: [],
			deps: [
				pageFunctions.getElementsInDocumentString,
				pageFunctions.getNodeDetailsString,
			]
		});
	}
}

module.exports = ObjectElements;