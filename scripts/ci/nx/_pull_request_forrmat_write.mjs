// @ts-check

import { PR_BRANCH } from "./_const.mjs";
import { gitPushChanges } from "./_git_push.mjs";
import { hasGitChanges, runNxCommand } from "./_utils.mjs";

class PullRequestFormatWrite {
    async run() {
        await runNxCommand('format:write');
        if (await hasGitChanges()) {
            console.log('Pushing changes');
            await gitPushChanges({ message: 'fix: format files', branch: PR_BRANCH});
            return true;
        }
        console.log('No changes to push');
        return false;
    }
}

export const formatWriteHasChanges = new PullRequestFormatWrite();