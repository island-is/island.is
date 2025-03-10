// @ts-check
import github from '@actions/github'
import core from '@actions/core'
import { MAIN_BRANCHES, RELEASE_BRANCHES } from './const.mjs';

const randomTag = createRandomString(16)
const context = github.context
const eventName = context.eventName
const sha = context.payload.pull_request?.head.sha || context.sha

const targetBranch = getTargetBranch()

core.setOutput('SHOULD_RUN_BUILD', JSON.stringify(shouldRun()))
if (!shouldRun()) {
    process.exit(0);
}
const typeOfDeployment = getTypeOfDeployment()
const artifactName = getArtifactname()
const tagName = getTagname()

core.setOutput('ARTIFACT_NAME', artifactName)
core.setOutput('DOCKER_TAG', tagName)
core.setOutput('GIT_BRANCH', targetBranch)
core.setOutput('GIT_SHA', sha)
console.info(`Artifact name: ${artifactName}`)
console.info(`Docker tag: ${tagName}`)
console.info(`Git branch: ${targetBranch}`)
console.info(`Git SHA: ${sha}`)

function shouldRun() {
    if (eventName === 'merge_group') {
        if (MAIN_BRANCHES.includes(targetBranch)) {
            return true;
        }
        if (RELEASE_BRANCHES.includes(targetBranch)) {
            return true;
        }
    }
    return false;
}

function getTagname() {
    if (eventName === 'pull_request' && context.payload.pull_request?.number) {
        throw new Error(`Unsupported event: ${eventName}`)
        // return `pr-${context.payload.pull_request.number}-${randomTag}`;
    }
    if (eventName === 'merge_group') {
        const dateString = new Date().toISOString().split('T')[0].replace(/-/g, '')
        if (typeOfDeployment.dev) {
            return `dev_${dateString}_${randomTag}`
        }
        if (typeOfDeployment.prod) {
            return `release_${dateString}_${randomTag}`
        }
        throw new Error(`Unable to determine artifact name for merge_group event`)
    }
    throw new Error(
        `Unable to determine artifact name for event type: ${eventName}`,
    )
}

function getArtifactname() {
    if (eventName === 'pull_request' && context.payload.pull_request?.number) {
        throw new Error(`Unsupported event: ${eventName}`)
        // return `pr-${context.payload.pull_request.number}`;
    }
    if (eventName === 'merge_group') {
        if (typeOfDeployment.dev) {
            return `main-${context.payload.merge_group.head_sha}`
        }
        if (typeOfDeployment.prod) {
            return `release-${context.payload.merge_group.head_sha}`
        }
        throw new Error(`Unable to determine artifact name for merge_group event`)
    }

    throw new Error(
        `Unable to determine artifact name for event type: ${eventName}`,
    )
}

function getTypeOfDeployment() {
    if (MAIN_BRANCHES.includes(targetBranch)) {
        return {
            dev: true,
            prod: false,
        }
    }
    if (RELEASE_BRANCHES.includes(targetBranch)) {
        return {
            dev: false,
            prod: true,
        }
    }
    // UNKNOWN BRANCH
    // console.error(`Unknown branch: ${targetBranch} - not sure how to tag this deployment`);
    throw new Error(`Unsupported branch: ${targetBranch}`)
}

function getTargetBranch() {
    if (eventName === 'pull_request' && context.payload?.pull_request?.base.ref) {
        return context.payload.pull_request.base.ref
    }
    if (eventName === 'merge_group') {
        return context.payload.merge_group.base_ref.replace('refs/heads/', '')
    }

    throw new Error(
        `Unable to determine target branch for event type: ${eventName}`,
    )
}

function createRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
