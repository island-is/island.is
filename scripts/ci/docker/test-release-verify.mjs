// @ts-check
import AWS from 'aws-sdk'
import { getSingleProject } from './release-reuse-utils.mjs'
import { parseChunks } from './reuse-release-images.mjs'
import { isMainModule } from './utils.mjs'

/**
 * Checks the outcome of reuse-release-images.mjs in test-release.yml against
 * what is actually in ECR. Deliberately does not use ecr-images.mjs, so that a
 * bug in there does not also hide here.
 */
async function getDigest(ecr, repositoryName, imageTag) {
  try {
    const response = await ecr
      .batchGetImage({ repositoryName, imageIds: [{ imageTag }] })
      .promise()
    return response.images?.[0]?.imageId?.imageDigest
  } catch (error) {
    if (error?.code === 'RepositoryNotFoundException') {
      return undefined
    }
    throw error
  }
}

const sorted = (values) => [...values].sort()
const same = (a, b) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b))

export async function verifyReuse({
  ecr,
  chunks,
  buildChunks,
  reusedDockerData,
  preReleaseTag,
  releaseTag,
}) {
  const errors = []
  const projects = chunks.map(getSingleProject)

  const sourceDigests = {}
  for (const project of projects) {
    sourceDigests[project] = await getDigest(ecr, project, preReleaseTag)
  }
  const expectReused = projects.filter((project) => sourceDigests[project])
  const expectBuilt = projects.filter((project) => !sourceDigests[project])

  // Otherwise we are not testing both outcomes
  if (expectReused.length === 0) {
    errors.push(`No project has the pre-release image ${preReleaseTag}`)
  }
  if (expectBuilt.length === 0) {
    errors.push('Every project has a pre-release image, expected one without')
  }

  const reused = reusedDockerData.map(({ project }) => project)
  if (!same(reused, expectReused)) {
    errors.push(`Reused [${reused}], expected [${expectReused}]`)
  }
  const built = buildChunks.map(getSingleProject)
  if (!same(built, expectBuilt)) {
    errors.push(`Left [${built}] to build, expected [${expectBuilt}]`)
  }

  for (const { project, imageTag, sourceTag } of reusedDockerData) {
    if (imageTag !== releaseTag || sourceTag !== preReleaseTag) {
      errors.push(`${project}: unexpected tags ${sourceTag} -> ${imageTag}`)
    }
    const digest = await getDigest(ecr, project, releaseTag)
    if (!digest || digest !== sourceDigests[project]) {
      errors.push(
        `${project}: ${releaseTag} is ${digest}, but ${preReleaseTag} is ${sourceDigests[project]}`,
      )
    }
  }

  for (const project of expectBuilt) {
    if (await getDigest(ecr, project, releaseTag)) {
      errors.push(`${project}: ${releaseTag} exists, but nothing to reuse`)
    }
  }

  return errors
}

export async function main() {
  const { BUILD_CHUNKS, REUSED_DOCKER_DATA, PRE_RELEASE_TAG, RELEASE_TAG } =
    process.env
  if (
    !BUILD_CHUNKS ||
    !REUSED_DOCKER_DATA ||
    !PRE_RELEASE_TAG ||
    !RELEASE_TAG
  ) {
    throw new Error(
      'BUILD_CHUNKS, REUSED_DOCKER_DATA, PRE_RELEASE_TAG and RELEASE_TAG are required',
    )
  }

  const errors = await verifyReuse({
    ecr: new AWS.ECR({ region: process.env.AWS_REGION ?? 'eu-west-1' }),
    chunks: parseChunks(process.env.DOCKER_CHUNKS),
    // The docker-build matrix is an array of JSON strings
    buildChunks: JSON.parse(BUILD_CHUNKS).map((chunk) => JSON.parse(chunk)),
    reusedDockerData: JSON.parse(REUSED_DOCKER_DATA),
    preReleaseTag: PRE_RELEASE_TAG,
    releaseTag: RELEASE_TAG,
  })

  if (errors.length > 0) {
    errors.forEach((error) => console.error(`✗ ${error}`))
    process.exit(1)
  }
  console.info('✓ Reused images match what is in ECR')
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
