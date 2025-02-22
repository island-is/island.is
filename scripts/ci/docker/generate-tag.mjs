// @ts-check
import github from "@actions/github";
import core from "@actions/core";

const randomTag = createRandomString(16);
const context = github.context;
const eventName = context.eventName;

const targetBranch = getTargetBranch();
const typeOfDeployment = getTypeOfDeployment();
const artifactName = getArtifactname();
const tagName = getTagname();

core.setOutput("ARTIFACT_NAME", artifactName);
core.setOutput("TAG_NAME", tagName);

function getTagname() {
    if (eventName === "pull_request" && context.payload.pull_request?.number) {
        return `pr-${context.payload.pull_request.number}-${randomTag}`;
    }
    if (eventName === "merge_group") {
        if (typeOfDeployment.dev) {
            return `main-${randomTag}`;
        }
        if (typeOfDeployment.prod) {
            return `release-${randomTag}`;
        }
        throw new Error(`Unable to determine artifact name for merge_group event`);
    }

}

function getArtifactname() {
    if (eventName === "pull_request" && context.payload.pull_request?.number) {
        return `pr-${context.payload.pull_request.number}`;
    }
    if (eventName === "merge_group") {
        if (typeOfDeployment.dev) {
            return `main-${context.payload.merge_group.head_sha}`;
        }
        if (typeOfDeployment.prod) {
            return `release-${context.payload.merge_group.head_sha}`;
        }
        throw new Error(`Unable to determine artifact name for merge_group event`);
    }

    throw new Error(`Unable to determine artifact name for event type: ${eventName}`);
}


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
    if (eventName === "pull_request" && context.payload?.pull_request?.base.ref) {
        return context.payload.pull_request.base.ref;
    }
    if (eventName === "merge_group") {
        return context.payload.merge_group.base_ref.replace('refs/heads/', '');
    }

    throw new Error(`Unable to determine target branch for event type: ${eventName}`);
}

function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
