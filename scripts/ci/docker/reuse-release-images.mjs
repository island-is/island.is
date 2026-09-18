// @ts-check
import AWS from 'aws-sdk'
import core from '@actions/core'
import github from '@actions/github'
import { isReleaseBranch } from './const.mjs'
import {
  buildImageData,
  chunkToBuildMatrix,
  getPreReleaseBranch,
  getPreReleaseImageTag,
  getSingleProject,
} from './release-reuse-utils.mjs'
import { findImage, retagImage } from './ecr-images.mjs'
import { isMainModule } from './utils.mjs'

const PRE_RELEASE_WORKFLOW = 'push.yml'
const CONCURRENCY = 8

/**
 * A release branch is a renamed pre-release branch, and every pre-release push
 * builds all images. So the images for the commit we are releasing already
 * exist, tagged by push.yml with the commit sha and the run number.
 *
 * We only ever reuse images built from exactly the commit being released. When
 * the pre-release build of that commit failed, is still running, or the release
 * branch has moved on (hotfix), nothing matches and the image is built as usual.
 *
 * Note that reused images keep the GIT_BRANCH / DD_GIT_* values baked in at
 * build time, so they report the pre-release branch. The commit sha is the same.
 */
export async function findPreReleaseSourceTags({
  octokit,
  owner,
  repo,
  releaseBranch,
  sha,
  // Only overridden by test-release.yml, where the images come from
  // test-pre-release.yml running on a pull request branch, with test- tags
  workflow = PRE_RELEASE_WORKFLOW,
  preReleaseBranch = getPreReleaseBranch(releaseBranch),
  tagPrefix = undefined,
}) {
  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
    {
      owner,
      repo,
      workflow_id: workflow,
      branch: preReleaseBranch,
      head_sha: sha,
      per_page: 100,
    },
  )

  return (response.data.workflow_runs ?? [])
    .filter(
      (run) => run.head_sha === sha && run.head_branch === preReleaseBranch,
    )
    .map((run) => run.run_number)
    .sort((a, b) => b - a)
    .map((runNumber) =>
      getPreReleaseImageTag(releaseBranch, sha, runNumber, tagPrefix),
    )
}

export async function prepareReleaseImageReuse({
  ecr,
  releaseBranch,
  dockerTag,
  chunks,
  sourceTags,
  warn = console.warn,
}) {
  if (!isReleaseBranch(releaseBranch) || sourceTags.length === 0) {
    return { buildChunks: chunks, reusedDockerData: [] }
  }

  const reused = await mapWithConcurrency(
    chunks,
    CONCURRENCY,
    async (chunk) => {
      const project = getSingleProject(chunk)
      if (!project) {
        return undefined
      }

      // Tags are immutable, so we can not fall back to building everything once
      // some images are retagged. Failing per image is safe: the target tag is
      // only created by the last call in here.
      try {
        const source = await findImage(ecr, project, sourceTags)
        if (!source) {
          return undefined
        }
        await retagImage(ecr, project, source, dockerTag)
        return buildImageData(chunk, dockerTag, source.tag)
      } catch (error) {
        warn(`Unable to reuse image for ${project}, building it: ${error}`)
        return undefined
      }
    },
  )

  return {
    buildChunks: chunks.filter((_, index) => !reused[index]),
    reusedDockerData: reused.filter(Boolean),
  }
}

async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index])
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  )
  return results
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

/**
 * Every image of the release was built by the pre-release, from the commit that
 * is being released. merge-queue.yml then has nothing to build, and does not
 * run tests, typecheck and e2e again either.
 */
export function allImagesReused(result) {
  return result.buildChunks.length === 0 && result.reusedDockerData.length > 0
}

export function setReuseOutputs(coreApi, result) {
  coreApi.setOutput('ALL_IMAGES_REUSED', String(allImagesReused(result)))
  coreApi.setOutput('BUILD_CHUNKS', chunkToBuildMatrix(result.buildChunks))
  coreApi.setOutput(
    'REUSED_DOCKER_DATA',
    JSON.stringify(result.reusedDockerData),
  )
}

async function writeSummary(result) {
  if (result.reusedDockerData.length === 0) {
    return
  }
  await core.summary
    .addHeading('Reused pre-release images', 3)
    .addTable([
      [
        { data: 'Image', header: true },
        { data: 'Pre-release tag', header: true },
        { data: 'Release tag', header: true },
      ],
      ...result.reusedDockerData.map(({ imageName, sourceTag, imageTag }) => [
        imageName,
        sourceTag,
        imageTag,
      ]),
    ])
    .write()
}

export async function main() {
  const { DOCKER_TAG, GITHUB_TOKEN, RELEASE_BRANCH, RELEASE_SHA } = process.env
  if (!DOCKER_TAG || !GITHUB_TOKEN || !RELEASE_SHA) {
    throw new Error('DOCKER_TAG, GITHUB_TOKEN and RELEASE_SHA are required')
  }
  const chunks = parseChunks(process.env.DOCKER_CHUNKS)

  // Nothing is retagged yet, so on any failure here we just build everything.
  let sourceTags = []
  try {
    sourceTags = await findPreReleaseSourceTags({
      octokit: github.getOctokit(GITHUB_TOKEN),
      ...github.context.repo,
      releaseBranch: RELEASE_BRANCH,
      sha: RELEASE_SHA,
      workflow: process.env.PRE_RELEASE_WORKFLOW || undefined,
      preReleaseBranch: process.env.PRE_RELEASE_BRANCH || undefined,
      tagPrefix: process.env.PRE_RELEASE_TAG_PREFIX || undefined,
    })
  } catch (error) {
    core.warning(`Unable to look up pre-release runs, building all: ${error}`)
  }
  console.info(`Pre-release tags for ${RELEASE_SHA}:`, sourceTags)

  const startedAt = Date.now()
  const result = await prepareReleaseImageReuse({
    ecr: new AWS.ECR({
      region: process.env.AWS_REGION ?? 'eu-west-1',
      maxRetries: 8,
    }),
    releaseBranch: RELEASE_BRANCH,
    dockerTag: DOCKER_TAG,
    chunks,
    sourceTags,
    warn: core.warning,
  })
  console.info(
    `Reused ${result.reusedDockerData.length} of ${chunks.length} images in ${
      Date.now() - startedAt
    }ms`,
  )

  setReuseOutputs(core, result)
  await writeSummary(result)
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
