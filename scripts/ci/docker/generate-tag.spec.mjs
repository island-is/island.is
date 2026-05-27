import { describe, expect, test } from '@jest/globals'
import { getOutput, getTypeOfDeployment } from './generate-tag.mjs'

const sha = 'db609e6641abcdef1234567890abcdef12345678'
const randomTag = 'wXu9m2hGVp8gyEpU'

const workflowDispatchContext = (branch) => ({
  eventName: 'workflow_dispatch',
  ref: `refs/heads/${branch}`,
  sha,
  payload: {},
})

const mergeGroupContext = (branch) => ({
  eventName: 'merge_group',
  ref: 'refs/heads/gh-readonly-queue/main/pr-123-test',
  sha,
  payload: {
    merge_group: {
      base_ref: `refs/heads/${branch}`,
      head_sha: 'merge-group-head-sha',
    },
  },
})

const pullRequestContext = (branch) => ({
  eventName: 'pull_request',
  ref: 'refs/pull/123/merge',
  sha: 'merge-sha',
  payload: {
    pull_request: {
      number: 123,
      head: {
        sha,
      },
      base: {
        ref: branch,
      },
      labels: [{ name: 'deploy-feature' }],
    },
  },
})

const pushContext = (branch) => ({
  eventName: 'push',
  ref: `refs/heads/${branch}`,
  sha,
  payload: {},
})

describe('generate-tag.mjs', () => {
  test('generates release tag for workflow_dispatch on calver release branch', () => {
    const output = getOutput(
      workflowDispatchContext('release/2026.5.26.0'),
      randomTag,
    )

    expect(output).toEqual({
      shouldRun: true,
      artifactName: `release-${sha}`,
      deployJudicial: false,
      helmValuesBranch: 'release',
      sha,
      tagName: `release_2026.5.26.0_db609e6_${randomTag}`,
      targetBranch: 'release/2026.5.26.0',
    })
  })

  test('generates release tag for merge_group on calver release branch', () => {
    const output = getOutput(
      mergeGroupContext('release/2026.5.26.0'),
      randomTag,
    )

    expect(output).toEqual({
      shouldRun: true,
      artifactName: 'release-merge-group-head-sha',
      deployJudicial: false,
      helmValuesBranch: 'release',
      sha,
      tagName: `release_2026.5.26.0_db609e6_${randomTag}`,
      targetBranch: 'release/2026.5.26.0',
    })
  })

  test('keeps semver release branch behavior', () => {
    const output = getOutput(workflowDispatchContext('release/41.1.0'), randomTag)

    expect(output.tagName).toBe(`release_41.1.0_db609e6_${randomTag}`)
    expect(output.artifactName).toBe(`release-${sha}`)
    expect(output.helmValuesBranch).toBe('release')
  })

  test('keeps main branch behavior', () => {
    const output = getOutput(workflowDispatchContext('main'), randomTag)

    expect(output.tagName).toBe(`dev_db609e6_${randomTag}`)
    expect(output.artifactName).toBe(`main-${sha}`)
    expect(output.helmValuesBranch).toBe('main')
    expect(output.deployJudicial).toBe(true)
  })

  test('keeps pull request feature deployment tag behavior', () => {
    const output = getOutput(pullRequestContext('main'), randomTag)

    expect(output.tagName).toBe(`pr-db609e6-${randomTag}`)
    expect(output.artifactName).toBe('pr-123')
    expect(output.helmValuesBranch).toBe('main')
  })

  test('generates prerelease tag for calver pre-release push', () => {
    const output = getOutput(
      pushContext('pre-release/2026.5.26.0'),
      randomTag,
    )

    expect(output.tagName).toBe(`prerelease_db609e6_${randomTag}`)
    expect(output.artifactName).toBe(`prerelease-${sha}`)
    expect(output.helmValuesBranch).toBe('main')
  })

  test('does not classify invalid release-like branches as dev', () => {
    expect(() =>
      getOutput(workflowDispatchContext('release/2026'), randomTag),
    ).toThrow('Unsupported branch: release/2026')

    expect(() => getTypeOfDeployment('pre-release/foo.bar')).toThrow(
      'Unsupported branch: pre-release/foo.bar',
    )
  })
})
