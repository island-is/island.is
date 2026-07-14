// @ts-check
import AWS from 'aws-sdk'
import core from '@actions/core'
import { isReleaseBranch } from './const.mjs'
import {
  buildImageData,
  chunkToBuildMatrix,
  getPreReleaseTagPrefix,
  getReleaseTagPrefix,
  getSingleProject,
} from './release-reuse-utils.mjs'
import {
  findLatestImageTag,
  hasImageTagWithPrefix,
  retagImage,
} from './ecr-images.mjs'

const SENTINEL_REPOSITORY = 'web'

export async function prepareReleaseImageReuse({
  ecr,
  releaseBranch,
  dockerTag,
  chunks,
}) {
  if (!isReleaseBranch(releaseBranch) || chunks.length === 0) {
    return {
      initialReleaseRun: false,
      buildChunks: chunks,
      reusedDockerData: [],
    }
  }

  const releasePrefix = getReleaseTagPrefix(releaseBranch)
  const hasReleaseImages = await hasImageTagWithPrefix(
    ecr,
    SENTINEL_REPOSITORY,
    releasePrefix,
  )

  if (hasReleaseImages) {
    return {
      initialReleaseRun: false,
      buildChunks: chunks,
      reusedDockerData: [],
    }
  }

  const preReleasePrefix = getPreReleaseTagPrefix(releaseBranch)
  const buildChunks = []
  const reusedDockerData = []

  for (const chunk of chunks) {
    const project = getSingleProject(chunk)
    if (!project) {
      buildChunks.push(chunk)
      continue
    }

    const sourceTag = await findLatestImageTag(ecr, project, preReleasePrefix)
    if (!sourceTag) {
      buildChunks.push(chunk)
      continue
    }

    const result = await retagImage(ecr, project, sourceTag, dockerTag)
    if (result.reused) {
      reusedDockerData.push(buildImageData(chunk, dockerTag))
    } else {
      buildChunks.push(chunk)
    }
  }

  return { initialReleaseRun: true, buildChunks, reusedDockerData }
}

export function parseChunks(value) {
  if (!value) {
    return []
  }
  const trimmed = value.trim()
  const normalized =
    trimmed.startsWith("'") && trimmed.endsWith("'")
      ? trimmed.slice(1, -1)
      : trimmed
  const parsed = JSON.parse(normalized)
  if (!Array.isArray(parsed)) {
    throw new Error('DOCKER_CHUNKS must be a JSON array')
  }
  return parsed
}

export function setReuseOutputs(coreApi, result) {
  coreApi.setOutput('INITIAL_RELEASE_RUN', String(result.initialReleaseRun))
  coreApi.setOutput('CHUNKS', JSON.stringify(result.buildChunks))
  coreApi.setOutput('BUILD_CHUNKS', chunkToBuildMatrix(result.buildChunks))
  coreApi.setOutput(
    'REUSED_DOCKER_DATA',
    JSON.stringify(result.reusedDockerData),
  )
}

export async function main() {
  if (!process.env.DOCKER_TAG) {
    throw new Error('DOCKER_TAG is required')
  }
  const ecr = new AWS.ECR({ region: process.env.AWS_REGION ?? 'eu-west-1' })
  const result = await prepareReleaseImageReuse({
    ecr,
    releaseBranch: process.env.RELEASE_BRANCH,
    dockerTag: process.env.DOCKER_TAG,
    chunks: parseChunks(process.env.DOCKER_CHUNKS),
  })
  setReuseOutputs(core, result)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
