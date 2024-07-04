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
try {
    await runCommand(`yarn nx format:${action} --all`, ROOT);
} catch (error) {
    // Ignore errors.
    if (!canWrite) {
        setFailed('Error running format check.');
        process.exit(1);
    }
}

if (canWrite) {
    const shouldWrite = await hasUnstagedChanges();
    if (shouldWrite) {
        info("Unstaged changes found. Committing changes.");
        await commitUnstagedChanges({ user: 'dirtybot', message: 'chore: format files' });
        setFailed('Unstaged changes for formatting were committed.');
        process.exit(1);
    }
    info("No unstaged changes found.");
    process.exit(0);
}


