const { Gatherer } = require("lighthouse");

class AdsTxt extends Gatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['snapshot', 'navigation'],
  };
  /**
  * @param {LH.Gatherer.PassContext} options
  * @param {LH.Gatherer.LoadData} loadData
  */
  async afterPass(options, loadData) {
    const driver = options.driver;

    const {finalUrl} = options.baseArtifacts.URL;
    const adsTxtUrl = new URL('/ads.txt', finalUrl).href;

    const response = await fetch(adsTxtUrl)
    const content = await response.text();
    const headers = await response.headers;
    const status = response.status;
    const statusText = response.statusText;

    return { status, headers, content, statusText };
  }
}

module.exports = AdsTxt;