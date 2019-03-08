'use strict';

/**
 * Grunt task to create new release on GitHub.
 */

const Octokit = require('@octokit/rest');
const GitHubApi = new Octokit();

const owner = 'web-scrobbler';
const repo = 'web-scrobbler';

module.exports = (grunt) => {
	grunt.registerTask('github_publish', 'Create a release on GitHub', async function() {
		let done = this.async();
		let data = grunt.config.get(this.name);
		let tagName = `v${data.version}`;

		GitHubApi.authenticate({ type: 'token', token: data.token });

		try {
			await publishRelease(tagName);
			grunt.log.ok(`Created release for ${tagName} version`);
		} catch (err) {
			grunt.log.error(err.message);
		} finally {
			done();
		}
	});
};

/**
 * Publish release on GitHub.
 * Find previously created draft release and make it as published one.
 *
 * @param  {String} tagName Git tag
 */
async function publishRelease(tagName) {
	let release = await getReleaseByName(tagName);
	if (!release.draft) {
		throw new Error(`Unable to create release: ${tagName} is not a draft release`);
	}

	let draft = false;
	let tag_name = tagName;
	let release_id = release.id;

	await GitHubApi.repos.updateRelease({ owner, repo, release_id, draft, tag_name });
}

/**
 * Get release by git tag.
 * @param  {String} tagName Git tag
 * @return {Promise} Promise resolved with release object
 */
async function getReleaseByName(tagName) {
	let response = await GitHubApi.repos.listReleases({ owner, repo });
	if (!response) {
		throw new Error(`${owner}/${repo} has no releases`);
	}

	let releases = response.data;
	for (let release of releases) {
		// Drafts have no `tag` property
		if (release.name === tagName) {
			return release;
		}
	}

	throw new Error(`${owner}/${repo} has no ${tagName} release`);
}
