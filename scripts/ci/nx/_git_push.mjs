import { runCommand } from "./_utils.mjs";

// @ts-check
export async function gitPushChanges(message) {
    await runCommand("git config user.name 'andes-it'");
    await runCommand("git config user.email 'builders@andes.is");
    await runCommand("git add -A");
    await runCommand(`git commit -m '${message}'`);
    await runCommand("git push");
}