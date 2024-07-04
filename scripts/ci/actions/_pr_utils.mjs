
// @ts-check
import { context, getOctokit } from '@actions/github';
import { setFailed } from '@actions/core';

export const isPR = !!context.payload.pull_request;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
if (!GITHUB_TOKEN) {
    setFailed('GITHUB_TOKEN is required');
    process.exit(1);
}
export const { owner, repo } = context.repo;
export const pullNumber = context.payload.pull_request?.number ?? null;
export const octokit = getOctokit(GITHUB_TOKEN);

const hasLabelDefaultValues = { owner, repo, pullNumber };

// Dumb cache so we don't have to fetch again and again
const _LABEL_CACHE = {};
const _LABEL_OWNER_CACHE = {};

/**
 * Checks if a pull request has a specific label.
 *
 * @param {string} labelName - The name of the label to check.
 * @param {Object} options - The options object.
 * @param {string} options.owner - The owner of the repository.
 * @param {string} options.repo - The name of the repository.
 * @param {number|null} options.pullNumber - The pull request number. Can be null if not defined.
 * @returns {Promise<string>} - Pull owner.
 * @throws {Error} - If the pull number is not defined.
 */
export async function findLabelOwner(labelName, page = 0, { owner, repo, pullNumber } = hasLabelDefaultValues) {
    if (!pullNumber) {
        throw new Error(`Pull number not defined`);
    }
    if (_LABEL_OWNER_CACHE[pullNumber]?.[labelName]) {
        return _LABEL_OWNER_CACHE[pullNumber][labelName];
    }
    const { data: events, ...settings } = await octokit.rest.issues.listEventsForTimeline({
        owner,
        repo,
        page,
        issue_number: pullNumber,
        per_page: 100, 
    });
    const hasAnotherPage = !!settings.headers.link?.includes('rel="next"');
    const labelEvent = events.reverse().find(event => 
        event.event === 'labeled' && 'label' in event && event.label && event.label.name === labelName
    );
    

    const labelOwner = labelEvent && 'actor' in labelEvent && labelEvent.actor != null ? labelEvent.actor.login : null;

    if (!labelOwner) {
        if (hasAnotherPage) {
            return findLabelOwner(labelName, page + 1, { owner, repo, pullNumber });
        }
        throw new Error(`Label ${labelName} not found in timeline`);
    }

    _LABEL_CACHE[pullNumber] ??= {};
    _LABEL_CACHE[pullNumber][labelName] = labelOwner;

    return labelOwner;

}

/**
 * Checks if a pull request has a specific label.
 *
 * @param {string} labelName - The name of the label to check.
 * @param {Object} options - The options object.
 * @param {string} options.owner - The owner of the repository.
 * @param {string} options.repo - The name of the repository.
 * @param {number|null} options.pullNumber - The pull request number. Can be null if not defined.
 * @returns {Promise<boolean>} - True if the pull request has the specified label, false otherwise.
 * @throws {Error} - If the pull number is not defined.
 */
export async function hasLabel(labelName, { owner, repo, pullNumber } = hasLabelDefaultValues) {
    if (!pullNumber) {
        throw new Error(`Pull number not defined`);
    }
    const labels = await (async () => {
        if (_LABEL_CACHE[pullNumber]) {
            return _LABEL_CACHE[pullNumber];
        }
        const { data: prData } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: pullNumber,
        });
        _LABEL_CACHE[pullNumber] = prData.labels;
        return prData.labels;
    })();
    return labels.some(label => label.name.trim() === labelName.trim());
}

