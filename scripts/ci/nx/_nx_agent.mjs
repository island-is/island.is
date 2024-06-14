// @ts-check
import { runNxCloudCommand } from './_utils.mjs';

export async function startNxAgents() {
    const command = 'start-ci-run --distribute-on="8 linux-medium-js" --stop-agents-after=format --with-env-vars="auto"';
    return runNxCloudCommand(command);
}

// stop agents
export async function stopNxAgents() {
    const command = 'npx nx-cloud stop-all-agents';
    return runNxCloudCommand(command);
}
