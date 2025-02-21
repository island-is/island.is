import core from "@actions/core";
import github from "@actions/github";

const context = github.context;
const eventName = context.eventName;
const targetBranch = getTargetBranch();
const typeOfDeployment = getTypeOfDeployment();

console.log({
    targetBranch,
    typeOfDeployment
})


function getTypeOfDeployment() {
    if (targetBranch === 'main') {
        return {
            dev: true,
            prod: false
        }
    }
    if (targetBranch.startsWith('release')) {
        return {
            dev: false,
            prod: true
        }
    }
    // UNKNOWN BRANCH
    console.error(`Unknown branch: ${targetBranch} - not sure how to tag this deployment`);
    return {
        dev: false,
        prod: false
    }
}


function getTargetBranch() {
    if (eventName === "pull_request") {
        return context.payload.pull_request?.base?.ref;
    }

    if (eventName === "push") {
        return context.ref?.replace('refs/heads/', '');
    }

    if (eventName === "workflow_run") {
        if (context.payload.workflow_run.event === 'pull_request' &&
            context?.payload?.workflow_run?.pull_requests?.length > 0) {
            return context.payload.workflow_run.pull_requests[0].base.ref;
        }

        if (context.payload.workflow_run.merge_queue_entry) {
            return context.payload.workflow_run.merge_queue_entry.base_ref;
        }
        return context.payload.workflow_run.head_branch;
    }

    if (process.env.GITHUB_BASE_REF) {
        return process.env.GITHUB_BASE_REF;
    }

    throw new Error(`Unable to determine target branch for event type: ${eventName}`);
}