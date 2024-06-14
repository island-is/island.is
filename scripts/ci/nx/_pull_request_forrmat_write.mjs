// @ts-check

import { gitPushChanges } from "./_git_push.mjs";
import { hasGitChanges, runCommand, runNxCommand } from "./_utils.mjs";

class PullRequestFormatWrite {
    async run() {
        await runNxCommand('format:write');
        if (await hasGitChanges()) {
            console.log('Pushing changes');
            await gitPushChanges('fix: format files');
            return true;
        }
        console.log('No changes to push');
        return false;
    }
}

export const formatWriteHasChanges = new PullRequestFormatWrite();