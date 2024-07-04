// @ts-check
import { runCommand } from "./_utils.mjs";

const GITHUB_ACTION_USER = {
    name: 'github-actions[bot]',
    email: 'github-actions[bot]@users.noreply.github.com',
};

const DIRTYBOT_USER = {
    name: 'andes-it',
    email: 'builders@andes.is',
};


export async function hasUnstagedChanges() {
    const values = (await runCommand('git diff --stat')).trim();
    return !!values;
}

/**
 * Commits unstaged changes to the Git repository.
 *
 * @param {Object} options - The options for committing unstaged changes.
 * @param {'github-actions' | 'dirtybot'} options.user - The user performing the commit.
 * @param {string} options.message - The commit message.
 * @returns {Promise<void>} - A promise that resolves when the commit is complete.
 */
export async function commitUnstagedChanges({ user, message: action }) {
    const {name, email} = user === 'github-actions' ? GITHUB_ACTION_USER : DIRTYBOT_USER;
    await runCommand(["git", "config", "user.name",name]);
    await runCommand(["git", "config", "user.email", email]);
    await runCommand(["git", "add", "-A"]);
    await runCommand(["git", "commit", "-m", "chore: format files"]);
    // await runCommand(["git", "push"]);
}
