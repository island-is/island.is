// @ts-check
import { info } from "console";
import { runCommand } from "./_utils.mjs";
import { DIRTYBOT_TOKEN, GITHUB_TOKEN, owner, prBranch, repo } from "./_pr_utils.mjs";

const GITHUB_ACTION_USER = {
    name: 'github-actions[bot]',
    email: 'github-actions[bot]@users.noreply.github.com',
    token: GITHUB_TOKEN
};

const DIRTYBOT_USER = {
    name: 'andes-it',
    email: 'builders@andes.is',
    token: DIRTYBOT_TOKEN
};


export async function getUnstagedChanges() {
    const values = (await runCommand('git diff --stat')).trim().split('\n');
    return !!values === false ? false : values;
}

/**
 * Commits unstaged changes to the Git repository.
 *
 * @param {Object} options - The options for committing unstaged changes.
 * @param {'github-actions' | 'dirtybot'} options.user - The user performing the commit.
 * @param {string} options.message - The commit message.
 * @returns {Promise<void>} - A promise that resolves when the commit is complete.
 */
export async function commitUnstagedChanges({ user, message }) {
    const { name, email, token } = user === 'github-actions' ? GITHUB_ACTION_USER : DIRTYBOT_USER;
    const currentBranch = await getCurrentBranch();
    const repoUrl = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
    await runCommand(["git", "remote", "set-url", "origin", repoUrl]);

    if (currentBranch === "HEAD") {
        // This is a detached HEAD, we need to checkout prBranch
        await runCommand(["git", "checkout", prBranch]);
    }
    await runCommand(["git", "config", "user.name",name]);
    await runCommand(["git", "config", "user.email", email]);
    await runCommand(["git", "add", "-A"]);
    await runCommand(["git", "commit", "-m", message]);
    // await runCommand(["git", "push"]);
}


export async function getCurrentBranch() {
    const value = (await runCommand('git rev-parse --abbrev-ref HEAD')).trim();
    return value;
}