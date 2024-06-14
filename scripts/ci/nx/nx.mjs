import { IS_PULLREQUEST } from "./_const.mjs";
import { startNxAgents } from "./_nx_agent.mjs";
import { hasGitChanges, runNxAffected } from "./_utils.mjs";

await startNxAgents();

if (IS_PULLREQUEST) {
    // If this is a pull request we want to start by formatting
    // and exiting early on changes
    await runNxAffected('format:write');
    if (await hasGitChanges()) {
        console.log('Changes detected after formatting, exiting');
        process.exit(1);
    }
}