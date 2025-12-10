// @ts-check
import github from '@actions/github'
import core from '@actions/core'
import { MAIN_BRANCHES, RELEASE_BRANCHES } from './const.mjs'
import { isFeatureDeployment } from './utils.mjs'

const randomTag = createRandomString(16)
const context = github.context
const eventName = context.eventName
const sha = context.payload.pull_request?.head.sha || context.sha
const shortSha = sha.slice(0, 7)
const targetBranch = getTargetBranch()

core.setOutput('SHOULD_RUN_BUILD', JSON.stringify(shouldRun()))
if (!shouldRun()) {
  process.exit(0)
}
const typeOfDeployment = getTypeOfDeployment()
const artifactName = getArtifactname()
const tagName = getTagname()

core.setOutput('ARTIFACT_NAME', artifactName)
core.setOutput('DOCKER_TAG', tagName)
core.setOutput('HELM_VALUES_BRANCH', typeOfDeployment.dev ? 'main' : 'release')
core.setOutput('DEPLOY_JUDICIAL', targetBranch === 'main')
core.setOutput('GIT_BRANCH', targetBranch)
core.setOutput('GIT_SHA', sha)
console.info(`Artifact name: ${artifactName}`)
console.info(`Docker tag: ${tagName}`)
console.info(`Git branch: ${targetBranch}`)
console.info(`Git SHA: ${sha}`)
console.info(`Helm values branch: ${typeOfDeployment.dev ? 'main' : 'release'}`)

function shouldRun() {
  if (eventName === 'workflow_dispatch') {
    return true
  }
  if (eventName === 'merge_group') {
    return isTargetBranchCompatible(targetBranch)
  }
  if (isFeatureDeployment(context)) {
    return isTargetBranchCompatible(targetBranch)
  }
  return false
}

function isTargetBranchCompatible(targetBranch) {
  return (
    MAIN_BRANCHES.includes(targetBranch) ||
    RELEASE_BRANCHES.includes(targetBranch)
  )
}

function getTagname() {
  if (eventName === 'pull_request' && context.payload.pull_request?.number) {
    return `pr-${shortSha}-${randomTag}`
  }

  if (eventName === 'merge_group' || eventName === 'workflow_dispatch') {
    if (typeOfDeployment.dev) {
      return `dev_${shortSha}_${randomTag}`
    }
    if (typeOfDeployment.prod) {
      const version = targetBranch.replace('release/', '')
      return `release_${version}_${shortSha}_${randomTag}`
    }
    throw new Error(`Unable to determine artifact name for merge_group event`)
  }
  if (eventName === 'push') {
    if (typeOfDeployment.dev) {
      return `prerelease_${shortSha}_${randomTag}`
    }
    throw new Error(`Only supports pre-release push`)
  }
  throw new Error(
    `Unable to determine artifact name for event type: ${eventName}`,
  )
}

function getArtifactname() {
  if (eventName === 'pull_request' && context.payload.pull_request?.number) {
    return `pr-${context.payload.pull_request.number}`
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

  if (eventName === 'push') {
    if (typeOfDeployment.dev) {
      return `prerelease-${context.sha}`
    }
    throw new Error(`Only supports pre-release push`)
  }

  if (eventName === 'workflow_dispatch') {
    if (typeOfDeployment.dev) {
      return `main-${context.sha}`
    }
    if (typeOfDeployment.prod) {
      return `release-${context.sha}`
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
  return {
    dev: true,
    prod: false,
  }
  throw new Error(`Unsupported branch: ${targetBranch}`)
}

function getTargetBranch() {
  if (eventName === 'pull_request' && context.payload?.pull_request?.base.ref) {
    return context.payload.pull_request.base.ref.replace('refs/heads/', '')
  }
  if (eventName === 'merge_group') {
    return context.payload.merge_group.base_ref.replace('refs/heads/', '')
  }
  if (eventName === 'workflow_dispatch') {
    return context.ref.replace('refs/heads/', '')
  }

  if (eventName === 'push') {
    return context.ref.replace('refs/heads/', '')
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
