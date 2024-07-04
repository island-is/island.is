/**
 * Checks if user can run test-everything workflow.
 */

// @ts-check
import { setOutput, setFailed, info } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { checkPermission } from "./_check_permission.mjs";

const token = process.env.GITHUB_TOKEN;
if (!token) {
    setFailed('GITHUB_TOKEN is required');
    process.exit(1);
}

const octokit = getOctokit(token);

if (!context.payload.pull_request) {
    info('This is not a pull request. Skipping check.');
    process.exit(0);
}

const { owner, repo } = context.repo;
const pull_number = context.payload.pull_request.number;

const { data: prData } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number,
});

const hasTestEverythingLabel = prData.labels.some(label => label.name === 'test everything');

if (!hasTestEverythingLabel) {
    info('The "test everything" label is not set. Skipping check.');
    setTestEverything(false);
    process.exit(0);
}

info('The "test everything" label is set. Proceeding with permission check.');

const username = context.payload.pull_request.user.login;

const hasPermission = await checkPermission({
    owner,
    repo,
    username,
    token,
});

if (hasPermission) {
    info(`User ${username} has sufficient permissions.`);
    setTestEverything(true);
    process.exit(0);
}

setTestEverything(false);
setFailed(`User ${username} does not have sufficient permissions.`);


/**
 * Sets the value of 'test_everything' output.
 * @param {boolean} value - The value to set. Should be a boolean.
 */
function setTestEverything(value = false) {
    setOutput('TEST_EVERYTHING', value.toString())
}