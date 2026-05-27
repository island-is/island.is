// @ts-check
import github from '@actions/github'
import core from '@actions/core'
import { getReleaseVersion, isMainBranch, isReleaseBranch } from './const.mjs'
import { isFeatureDeployment, isMainModule } from './utils.mjs'

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

export async function main(
  testContext = github.context,
  randomTag = createRandomString(16),
) {
  const outputs = getOutputs(testContext, randomTag)
  core.setOutput('SHOULD_RUN_BUILD', JSON.stringify(outputs.shouldRun))

  if (!outputs.shouldRun) {
    process.exit(0)
  }

  core.setOutput('ARTIFACT_NAME', outputs.artifactName)
  core.setOutput('DOCKER_TAG', outputs.tagName)
  core.setOutput('HELM_VALUES_BRANCH', outputs.helmValuesBranch)
  core.setOutput('DEPLOY_JUDICIAL', outputs.deployJudicial)
  core.setOutput('GIT_BRANCH', outputs.targetBranch)
  core.setOutput('GIT_SHA', outputs.sha)
  console.info(`Artifact name: ${outputs.artifactName}`)
  console.info(`Docker tag: ${outputs.tagName}`)
  console.info(`Git branch: ${outputs.targetBranch}`)
  console.info(`Git SHA: ${outputs.sha}`)
  console.info(`Helm values branch: ${outputs.helmValuesBranch}`)
}

export function getOutputs(
  context = github.context,
  randomTag = createRandomString(16),
) {
  const sha = getSha(context)
  const shortSha = sha.slice(0, 7)
  const targetBranch = getTargetBranch(context)
  const run = shouldRun(context, targetBranch)

  if (!run) {
    return {
      shouldRun: false,
      targetBranch,
      sha,
    }
  }

  const typeOfDeployment = getTypeOfDeployment(targetBranch)
  const artifactName = getArtifactname(context, typeOfDeployment)
  const tagName = getTagname(
    context,
    typeOfDeployment,
    targetBranch,
    shortSha,
    randomTag,
  )

  return {
    shouldRun: true,
    artifactName,
    tagName,
    helmValuesBranch: typeOfDeployment.dev ? 'main' : 'release',
    deployJudicial: targetBranch === 'main',
    targetBranch,
    sha,
  }
}

export function shouldRun(context, targetBranch = getTargetBranch(context)) {
  const eventName = context.eventName

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

export function isTargetBranchCompatible(targetBranch) {
  return isMainBranch(targetBranch) || isReleaseBranch(targetBranch)
}

export function getTagname(
  context,
  typeOfDeployment,
  targetBranch,
  shortSha,
  randomTag,
) {
  const eventName = context.eventName

  if (eventName === 'pull_request' && context.payload.pull_request?.number) {
    return `pr-${shortSha}-${randomTag}`
  }

  if (eventName === 'merge_group' || eventName === 'workflow_dispatch') {
    if (typeOfDeployment.dev) {
      return `dev_${shortSha}_${randomTag}`
    }
    if (typeOfDeployment.prod) {
      const version = getReleaseVersion(targetBranch)
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

export function getArtifactname(context, typeOfDeployment) {
  const eventName = context.eventName

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

export function getTypeOfDeployment(targetBranch) {
  if (isMainBranch(targetBranch)) {
    return {
      dev: true,
      prod: false,
    }
  }
  if (isReleaseBranch(targetBranch)) {
    return {
      dev: false,
      prod: true,
    }
  }
  return {
    dev: true,
    prod: false,
  }
}

export function getTargetBranch(context = github.context) {
  const eventName = context.eventName

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

function getSha(context) {
  return context.payload?.pull_request?.head.sha || context.sha
}

function createRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
