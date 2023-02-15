const { Audit } = require("lighthouse");
const ThirdPartySummary = require("lighthouse/lighthouse-core/audits/third-party-summary.js");
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');
const MainThreadTasks = require('lighthouse/lighthouse-core/computed/main-thread-tasks.js');
const thirdPartyWeb = require('lighthouse/lighthouse-core/lib/third-party-web.js');

class GATag extends Audit {
	static get meta() {
		return {
			id: 'ga-tag',
			title: 'Google Analytics is present.',
			failureTitle: 'Google Analytics is not present.',
			description: 'Check if site is using Google Analytics.',
			requiredArtifacts: ['traces', 'devtoolsLogs', 'URL'],
		}
	}

	/**
	* @param {LH.Artifacts} artifacts
	* @param {LH.Audit.Context} context
	*/
	static async audit(artifacts, context) {
		const settings = context.settings || {};
		const trace = artifacts.traces[Audit.DEFAULT_PASS];
		const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
		const networkRecords = await NetworkRecords.request(devtoolsLog, context);
		const mainEntity = thirdPartyWeb.getEntity(artifacts.URL.finalUrl);
		const tasks = await MainThreadTasks.request(trace, context);
		const multiplier = settings.throttlingMethod === 'simulate' ? settings.throttling.cpuSlowdownMultiplier : 1;

		const summaries = ThirdPartySummary.getSummaries(networkRecords, tasks, multiplier);
		const overallSummary = {wastedBytes: 0, wastedMs: 0};

		const results = Array.from(summaries.byEntity.entries())
		// Don't consider the page we're on to be third-party.
		// e.g. Facebook SDK isn't a third-party script on facebook.com
		.filter(([entity]) => !(mainEntity && mainEntity.name === entity.name))
		.filter(([entity]) => entity.name == 'Google Analytics')
		.map(([entity, stats]) => {
			return {
				type: /** @type {const} */ ('link'),
				text: entity.name,
				url: entity.homepage || '',
			};
		});

		/**
		* @return {LH.Product}
		*/

		if(results.length == 0) {
			return {
				score: 0,
			}
		}

		return {
			score: 1,
		};
	}
}

module.exports = GATag;