import { getOutputs, getTypeOfDeployment } from './generate-tag.mjs'

const mergeGroupContext = (branch) => ({
  eventName: 'merge_group',
  sha: '1234567890abcdef',
  payload: {
    merge_group: {
      base_ref: `refs/heads/${branch}`,
      head_sha: 'merge-group-head-sha',
    },
  },
})

describe('generate-tag.mjs', () => {
  test('generates release docker tag outputs for calver release branch', () => {
    const outputs = getOutputs(
      mergeGroupContext('release/2026.5.26.0'),
      'randomtag',
    )

    expect(outputs).toEqual({
      shouldRun: true,
      artifactName: 'release-merge-group-head-sha',
      tagName: 'release_2026.5.26.0_1234567_randomtag',
      helmValuesBranch: 'release',
      deployJudicial: false,
      targetBranch: 'release/2026.5.26.0',
      sha: '1234567890abcdef',
    })
  })

  test('generates release docker tag outputs for semver release branch', () => {
    const outputs = getOutputs(mergeGroupContext('release/41.1.0'), 'randomtag')

    expect(outputs.shouldRun).toBe(true)
    expect(outputs.tagName).toBe('release_41.1.0_1234567_randomtag')
    expect(outputs.helmValuesBranch).toBe('release')
  })

  test('generates dev outputs for main branch', () => {
    const outputs = getOutputs(mergeGroupContext('main'), 'randomtag')

    expect(outputs.shouldRun).toBe(true)
    expect(outputs.tagName).toBe('dev_1234567_randomtag')
    expect(outputs.helmValuesBranch).toBe('main')
    expect(outputs.deployJudicial).toBe(true)
  })

  test('skips unsupported merge queue target branches', () => {
    const outputs = getOutputs(mergeGroupContext('feature/test'), 'randomtag')

    expect(outputs).toEqual({
      shouldRun: false,
      targetBranch: 'feature/test',
      sha: '1234567890abcdef',
    })
  })

  test('classifies calver release branch as prod deployment', () => {
    expect(getTypeOfDeployment('release/2026.5.26.0')).toEqual({
      dev: false,
      prod: true,
    })
  })
})
