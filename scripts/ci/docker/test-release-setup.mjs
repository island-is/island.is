// @ts-check
import core from '@actions/core'
import github from '@actions/github'
import { isReleaseBranch } from './const.mjs'
import {
  getPreReleaseImageTag,
  getPreReleaseTagPrefix,
} from './release-reuse-utils.mjs'
import { isMainModule } from './utils.mjs'

/**
 * Setup for test-pre-release.yml and test-release.yml, which rehearse reusing
 * pre-release images for a release without deploying anything.
 *
 * Both need to agree on a made up release version. It is derived from the
 * test-pre-release.yml run, <date of the run>.<run number>, so test-release.yml
 * can work it out again later. The run number keeps it clear of real releases.
 */
export const PRE_RELEASE_TEST_WORKFLOW = 'test-pre-release.yml'

// The images go to the real repositories, so their tags must not look like the
// tags of a real pre-release (pre-release-*) or release (release_*)
const TEST_TAG_PREFIX = 'test-'

// Never built by test-pre-release.yml, so that test-release.yml also sees an
// image it can not reuse
export const UNBUILT_PROJECT = 'github-actions-cache'

/**
 * All images are built by default, like for a real pre-release. Returns the
 * projects to limit it to, or nothing when it is not limited.
 */
export function getTestProjects(mode, projects = '') {
  const built = projects
    .split(',')
    .map((project) => project.trim())
    .filter((project) => project && project !== UNBUILT_PROJECT)
  if (built.length === 0) {
    return ''
  }
  return (mode === 'release' ? [...built, UNBUILT_PROJECT] : built).join(',')
}

export function getTestVersion(run) {
  const [year, month, day] = run.created_at.slice(0, 10).split('-').map(Number)
  return `${year}.${month}.${day}.${run.run_number}`
}

export function getTestSetup(preReleaseRun, sha, releaseTagSuffix) {
  const version = getTestVersion(preReleaseRun)
  const releaseBranch = `release/${version}`
  if (!isReleaseBranch(releaseBranch)) {
    throw new Error(`${releaseBranch} is not a valid release branch`)
  }

  const preReleaseTagPrefix = `${TEST_TAG_PREFIX}${getPreReleaseTagPrefix(
    releaseBranch,
  )}`

  return {
    version,
    releaseBranch,
    preReleaseTagPrefix,
    preReleaseTag: getPreReleaseImageTag(
      releaseBranch,
      sha,
      preReleaseRun.run_number,
      preReleaseTagPrefix,
    ),
    // Same shape as generate-tag.mjs gives a release
    releaseTag: `${TEST_TAG_PREFIX}release_${version}_${sha.slice(
      0,
      7,
    )}_${releaseTagSuffix}`,
  }
}

export async function findPreReleaseTestRun({
  octokit,
  owner,
  repo,
  branch,
  sha,
}) {
  let response
  try {
    response = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
      {
        owner,
        repo,
        workflow_id: PRE_RELEASE_TEST_WORKFLOW,
        branch,
        head_sha: sha,
        per_page: 100,
      },
    )
  } catch (error) {
    // The workflow is unknown to GitHub until it has run once
    if (error?.status === 404) {
      return undefined
    }
    throw error
  }

  // The workflow is also triggered, and skipped, for every other label
  return (response.data.workflow_runs ?? [])
    .filter((run) => run.head_sha === sha && run.conclusion === 'success')
    .sort((a, b) => b.run_number - a.run_number)[0]
}

export async function main() {
  const { GITHUB_TOKEN, GITHUB_RUN_ID, MODE, TEST_BRANCH, TEST_SHA } =
    process.env
  if (!GITHUB_TOKEN || !TEST_BRANCH || !TEST_SHA) {
    throw new Error('GITHUB_TOKEN, TEST_BRANCH and TEST_SHA are required')
  }
  const octokit = github.getOctokit(GITHUB_TOKEN)
  const { owner, repo } = github.context.repo

  let preReleaseRun
  if (MODE === 'pre-release') {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/runs/{run_id}',
      { owner, repo, run_id: Number(GITHUB_RUN_ID) },
    )
    preReleaseRun = response.data
  } else if (MODE === 'release') {
    preReleaseRun = await findPreReleaseTestRun({
      octokit,
      owner,
      repo,
      branch: TEST_BRANCH,
      sha: TEST_SHA,
    })
    if (!preReleaseRun) {
      throw new Error(
        `No successful ${PRE_RELEASE_TEST_WORKFLOW} run for ${TEST_SHA} on ${TEST_BRANCH}. Add the 'test-pre-release' label and wait for it to finish first.`,
      )
    }
  } else {
    throw new Error(`Unsupported MODE: ${MODE}`)
  }

  const setup = getTestSetup(
    preReleaseRun,
    TEST_SHA,
    `${GITHUB_RUN_ID}a${process.env.GITHUB_RUN_ATTEMPT ?? 1}`,
  )
  console.info(setup)
  core.setOutput('VERSION', setup.version)
  core.setOutput('RELEASE_BRANCH', setup.releaseBranch)
  core.setOutput('PRE_RELEASE_TAG_PREFIX', setup.preReleaseTagPrefix)
  core.setOutput('PRE_RELEASE_TAG', setup.preReleaseTag)
  core.setOutput('RELEASE_TAG', setup.releaseTag)
  core.setOutput(
    'PROJECTS',
    getTestProjects(MODE, process.env.TEST_PROJECTS || undefined),
  )
  core.setOutput('UNBUILT_PROJECT', UNBUILT_PROJECT)
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
