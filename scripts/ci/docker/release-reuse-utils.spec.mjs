import { describe, expect, test } from '@jest/globals'
import {
  buildImageData,
  chunkToBuildMatrix,
  getPreReleaseBranch,
  getPreReleaseImageTag,
  getPreReleaseTagPrefix,
} from './release-reuse-utils.mjs'

const webChunk = {
  projects: 'web',
  docker_type: 'docker-next',
  home: 'apps/web',
  dist: 'dist/apps/web',
}

describe('release-reuse-utils.mjs', () => {
  test('builds pre-release branch and tag prefix for calver branch', () => {
    const branch = 'release/2026.5.26.0'

    expect(getPreReleaseBranch(branch)).toBe('pre-release/2026.5.26.0')
    expect(getPreReleaseTagPrefix(branch)).toBe('pre-release-2026-5-26-0_')
  })

  test('builds pre-release branch and tag prefix for semver branch', () => {
    const branch = 'release/41.1.0'

    expect(getPreReleaseBranch(branch)).toBe('pre-release/41.1.0')
    expect(getPreReleaseTagPrefix(branch)).toBe('pre-release-41-1-0_')
  })

  test('builds the same image tag as push.yml did for a real release', () => {
    expect(
      getPreReleaseImageTag(
        'release/2026.09.15.00',
        'e6ee081a3a0000000000000000000000000000000',
        147799,
      ),
    ).toBe('pre-release-2026-09-15-00_e6ee081a3a_147799')
  })

  test('converts chunks to matrix string array', () => {
    expect(JSON.parse(chunkToBuildMatrix([webChunk]))).toEqual([
      JSON.stringify(webChunk),
    ])
  })

  test('creates synthetic build data with real docker target', () => {
    expect(buildImageData(webChunk, 'release_2026.5.26.0_sha_random')).toEqual({
      value: 'build',
      project: 'web',
      target: 'output-next',
      imageName: 'web',
      imageTag: 'release_2026.5.26.0_sha_random',
    })
  })

  test('records the source tag of reused images', () => {
    expect(
      buildImageData(webChunk, 'release_tag', 'pre-release_tag').sourceTag,
    ).toBe('pre-release_tag')
  })
})
