// @ts-check
import github from '@actions/github'
import core from '@actions/core'
import {
  isMainBranch,
  isPreReleaseBranch,
  isReleaseBranch,
  isReleaseLikeBranch,
} from './const.mjs'
import { isFeatureDeployment, isMainModule } from './utils.mjs'

if (isMainModule(import.meta.url)) {
  main()
}

export function main(context = github.context) {
  const output = getOutput(context, createRandomString(16))

  core.setOutput('SHOULD_RUN_BUILD', JSON.stringify(output.shouldRun))
  if (!output.shouldRun) {
    process.exit(0)
  }

  core.setOutput('ARTIFACT_NAME', output.artifactName)
  core.setOutput('DOCKER_TAG', output.tagName)
  core.setOutput('HELM_VALUES_BRANCH', output.helmValuesBranch)
  core.setOutput('DEPLOY_JUDICIAL', output.deployJudicial)
  core.setOutput('GIT_BRANCH', output.targetBranch)
  core.setOutput('GIT_SHA', output.sha)
  console.info(`Artifact name: ${output.artifactName}`)
  console.info(`Docker tag: ${output.tagName}`)
  console.info(`Git branch: ${output.targetBranch}`)
  console.info(`Git SHA: ${output.sha}`)
  console.info(`Helm values branch: ${output.helmValuesBranch}`)
}

export function getOutput(context, randomTag) {
  const eventName = context.eventName
  const sha = context.payload?.pull_request?.head.sha || context.sha
  const shortSha = sha.slice(0, 7)
  const targetBranch = getTargetBranch(context)
  const shouldRunBuild = shouldRun(context, targetBranch)

  if (!shouldRunBuild) {
    return {
      shouldRun: false,
    }
  }

  const typeOfDeployment = getTypeOfDeployment(targetBranch)

  return {
    shouldRun: true,
    artifactName: getArtifactname(context, typeOfDeployment),
    deployJudicial: targetBranch === 'main',
    helmValuesBranch: typeOfDeployment.dev ? 'main' : 'release',
    sha,
    tagName: getTagname(context, typeOfDeployment, shortSha, randomTag),
    targetBranch,
  }
}

export function shouldRun(context, targetBranch = getTargetBranch(context)) {
  if (context.eventName === 'workflow_dispatch') {
    return true
  }
  if (context.eventName === 'merge_group') {
    return isTargetBranchCompatible(targetBranch)
  }
  if (isFeatureDeployment(context)) {
    return isTargetBranchCompatible(targetBranch)
  }
  if (context.eventName === 'push') {
    return isPreReleaseBranch(targetBranch)
  }
  return false
}

export function isTargetBranchCompatible(targetBranch) {
  return (
    isMainBranch(targetBranch) ||
    isReleaseBranch(targetBranch) ||
    isPreReleaseBranch(targetBranch)
  )
}

export function getTagname(context, typeOfDeployment, shortSha, randomTag) {
  const eventName = context.eventName
  const targetBranch = getTargetBranch(context)

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
  if (isPreReleaseBranch(targetBranch)) {
    return {
      dev: true,
      prod: false,
    }
  }
  if (isReleaseLikeBranch(targetBranch)) {
    throw new Error(`Unsupported branch: ${targetBranch}`)
  }
  return {
    dev: true,
    prod: false,
  }
}

export function getTargetBranch(context = github.context) {
  if (
    context.eventName === 'pull_request' &&
    context.payload?.pull_request?.base.ref
  ) {
    return context.payload.pull_request.base.ref.replace('refs/heads/', '')
  }
  if (context.eventName === 'merge_group') {
    return context.payload.merge_group.base_ref.replace('refs/heads/', '')
  }
  if (context.eventName === 'workflow_dispatch') {
    return context.ref.replace('refs/heads/', '')
  }

  if (context.eventName === 'push') {
    return context.ref.replace('refs/heads/', '')
  }

  throw new Error(
    `Unable to determine target branch for event type: ${context.eventName}`,
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
