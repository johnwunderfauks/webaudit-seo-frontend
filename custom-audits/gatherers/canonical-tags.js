const { Gatherer } = require("lighthouse");
const pageFunctions = require("lighthouse/lighthouse-core/lib/page-functions");

class CanonicalElements extends Gatherer {
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

      // The tag names of the non-interactive elements which we'll check
      const tagNamesToCheck = ["link"];
      const selector = tagNamesToCheck.join(", ");
      const elements = Array.from(document.querySelectorAll(selector));

      const elementSummaries = elements.filter(Boolean).map((element) => {
        // getNodeDetails is put into scope via the "deps" array
        if (element.rel === "canonical") {
          return {
            tagName: element.tagName,
            node: getNodeDetails(element),
            textContent: element.textContent,
            rel: element.rel,
            href:element.href
          };
        }
      });

      /**
       * @return {LH.Gatherer.PhaseResult}
       */
      return elementSummaries;
    };

    return driver.executionContext.evaluate(mainFn, {
      args: [],
      deps: [
        pageFunctions.getElementsInDocumentString,
        pageFunctions.getNodeDetailsString,
      ],
    });
  }
}

module.exports = CanonicalElements;
