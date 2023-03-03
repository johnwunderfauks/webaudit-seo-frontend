const { Gatherer } = require("lighthouse");
const pageFunctions = require('lighthouse/lighthouse-core/lib/page-functions');

class SocialElements extends Gatherer {
	/**
	* @param {LH.Gatherer.PassContext} options
	* @param {LH.Gatherer.LoadData} loadData
	*/
	async afterPass(options, loadData) {
		const driver = options.driver;

		const mainFn = () => {

			/**
			* Returns a boolean indicating if the element has an event listener for type
			* @param {HTMLElement} element
			* @param {string} type Event type e.g. 'click'
			* @returns {boolean}
			*/
			function hasEventListener(element, type) {
				const eventListeners = getEventListeners(element);
				return !!eventListeners[type];
			}

            const tagNamesToCheck = ['meta'];
            const selector = tagNamesToCheck.join(', ');
			const elements = Array.from(document.querySelectorAll(selector));
			const elementSummaries = elements.filter(element => {
				if(element.getAttribute("property")) {
					 return {
						tagName: element.tagName,
						node: getNodeDetails(element),
						textContent: element.textContent,
					 }
				}
			   
			})
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

module.exports = SocialElements;