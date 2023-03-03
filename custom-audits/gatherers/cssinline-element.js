const { Gatherer } = require("lighthouse");
const pageFunctions = require("lighthouse/lighthouse-core/lib/page-functions");

class CssInlineElements extends Gatherer {
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

      const elements = Array.from(document.querySelectorAll("*"));

      const elementSummaries = elements.map((element) => {
        let css = Object.fromEntries(
          [...element.style].map((x) => [x, element.style[x]])
        );
        if (css && Object.keys(css).length !== 0) {
          return {
            tagName: element.tagName,
            node: getNodeDetails(element),
            textContent: element.textContent,
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

module.exports = CssInlineElements;
