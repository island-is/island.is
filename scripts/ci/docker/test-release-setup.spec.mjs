import { describe, expect, jest, test } from '@jest/globals'
import { isReleaseBranch } from './const.mjs'
import {
  findPreReleaseTestRun,
  getTestProjects,
  getTestSetup,
  getTestVersion,
} from './test-release-setup.mjs'

const sha = 'abcd123456789000000000000000000000000000'
const run = (run_number, overrides = {}) => ({
  run_number,
  head_sha: sha,
  conclusion: 'success',
  created_at: '2026-09-08T23:59:59Z',
  ...overrides,
})

describe('test-release-setup.mjs', () => {
  test('makes up a version from the date and number of the run', () => {
    expect(getTestVersion(run(412))).toBe('2026.9.8.412')
  })

  test('gives a valid release branch and the tags of push.yml and generate-tag.mjs', () => {
    const setup = getTestSetup(run(412), sha, '1a1')

    expect(isReleaseBranch(setup.releaseBranch)).toBe(true)
    expect(setup).toEqual({
      version: '2026.9.8.412',
      releaseBranch: 'release/2026.9.8.412',
      preReleaseTagPrefix: 'test-pre-release-2026-9-8-412_',
      preReleaseTag: 'test-pre-release-2026-9-8-412_abcd123456_412',
      releaseTag: 'test-release_2026.9.8.412_abcd123_1a1',
    })
    // Must never look like the tags of a real pre-release or release
    expect(setup.preReleaseTag.startsWith('pre-release-')).toBe(false)
    expect(setup.releaseTag.startsWith('release_')).toBe(false)
  })

  test('release test also gets the project that is never built', () => {
    expect(getTestProjects('pre-release', 'web, api')).toBe('web,api')
    expect(getTestProjects('release', 'web, api')).toBe(
      'web,api,github-actions-cache',
    )
    expect(getTestProjects('pre-release', 'web,github-actions-cache')).toBe(
      'web',
    )
  })

  test('finds newest successful test pre-release run of the commit', async () => {
    const octokit = {
      request: jest.fn(async () => ({
        data: {
          workflow_runs: [
            run(1),
            run(2),
            // Triggered by another label, or still running
            run(3, { conclusion: 'skipped' }),
            run(4, { conclusion: null }),
            run(5, { head_sha: 'ffff' }),
          ],
        },
      })),
    }

    await expect(
      findPreReleaseTestRun({
        octokit,
        owner: 'island-is',
        repo: 'island.is',
        branch: 'my-pr-branch',
        sha,
      }),
    ).resolves.toMatchObject({ run_number: 2 })
    expect(octokit.request).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        workflow_id: 'test-pre-release.yml',
        branch: 'my-pr-branch',
        head_sha: sha,
      }),
    )
  })

  test('finds nothing when the workflow has never run', async () => {
    const octokit = {
      request: jest.fn(async () => {
        throw Object.assign(new Error('Not Found'), { status: 404 })
      }),
    }

    await expect(
      findPreReleaseTestRun({
        octokit,
        owner: 'o',
        repo: 'r',
        branch: 'b',
        sha,
      }),
    ).resolves.toBe(undefined)
  })

  test('finds nothing when test pre-release has not succeeded', async () => {
    const octokit = {
      request: jest.fn(async () => ({
        data: { workflow_runs: [run(1, { conclusion: 'failure' })] },
      })),
    }

    await expect(
      findPreReleaseTestRun({
        octokit,
        owner: 'o',
        repo: 'r',
        branch: 'b',
        sha,
      }),
    ).resolves.toBe(undefined)
  })
})
