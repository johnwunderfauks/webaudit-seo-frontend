const { Gatherer } = require("lighthouse");
const pageFunctions = require("lighthouse/lighthouse-core/lib/page-functions");

class KeywordsElements extends Gatherer {
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

      let words = document.body.innerText.match(/\b(\w+)\b/g);

      let elementSummaries = [];

      for (let i=0; i<words.length; i++) {
        let findIndex = elementSummaries.findIndex(item => item.name.toLowerCase() === words[i].toLowerCase())
        if(findIndex !== -1) {
          elementSummaries[findIndex].count++;
        }else {
          elementSummaries.push({
            name: words[i].toLowerCase(),
            count: 1
          })
        }
      }

      elementSummaries.sort((a,b) => b.count - a.count)
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

module.exports = KeywordsElements;
