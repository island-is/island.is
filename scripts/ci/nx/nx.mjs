import { IS_PULLREQUEST } from "./_const.mjs";
import { NxAgents } from "./_nx_agent.mjs";
import { hasGitChanges, runNxCommand } from "./_utils.mjs";

console.log(IS_PULLREQUEST ? 'Running in pull request mode' : 'Running in push mode');
console.log('Starting agents');
await NxAgents.start();

if (IS_PULLREQUEST) {
    // If this is a pull request we want to start by formatting
    // and exiting early on changes
    console.log(`Running format:write`);
    await runNxCommand('format:write');
    console.log(`Done format:write`);
    if (await hasGitChanges()) {
        console.log('Changes detected after formatting, exiting');
        process.exit(1);
    }
}