/**
 * Formats the codebase and commits the changes if necessary.
 */
// @ts-check
import { setFailed, info } from '@actions/core';
import { commitUnstagedChanges, hasUnstagedChanges } from "./_git_utils.mjs";
import { isPR } from "./_pr_utils.mjs";
import { runCommand } from "./_utils.mjs";
import { ROOT } from './_common.mjs';


const canWrite = isPR;
const action = canWrite ? 'write' : 'check';

info(`Running format:${action} for all projects.`);
let files = [];
try {
    files = (await runCommand(`yarn nx format:${action} --all`, ROOT)).split('\n');
} catch (error) {
    // Ignore errors.
    if (!canWrite) {
        setFailed('Error running format check.');
        process.exit(1);
    }
}

if (canWrite && files.length > 0) {
    info(`The following files were formatted:\n${files.join('\n')}`)
    const unstagedChanges = await hasUnstagedChanges();
    if (unstagedChanges) {
        info(`Unstaged changes found:\n${unstagedChanges.join('\n')} Committing changes.`);
        await commitUnstagedChanges({ user: 'dirtybot', message: 'chore: format files' });
        setFailed('Unstaged changes for formatting were committed.');
        process.exit(1);
    }
    info("No unstaged changes found.");
    process.exit(0);
}


