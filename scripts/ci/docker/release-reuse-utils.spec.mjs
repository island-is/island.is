import { describe, expect, test } from '@jest/globals'
import {
  buildImageData,
  chunkToBuildMatrix,
  getPreReleaseTagPrefix,
  getReleaseTagPrefix,
} from './release-reuse-utils.mjs'

const webChunk = {
  projects: 'web',
  docker_type: 'docker-next',
  home: 'apps/web',
  dist: 'dist/apps/web',
}

describe('release-reuse-utils.mjs', () => {
  test('builds release and pre-release tag prefixes for calver branch', () => {
    const branch = 'release/2026.5.26.0'

    expect(getReleaseTagPrefix(branch)).toBe('release_2026.5.26.0_')
    expect(getPreReleaseTagPrefix(branch)).toBe('pre-release-2026-5-26-0_')
  })

  test('builds release and pre-release tag prefixes for semver branch', () => {
    const branch = 'release/41.1.0'

    expect(getReleaseTagPrefix(branch)).toBe('release_41.1.0_')
    expect(getPreReleaseTagPrefix(branch)).toBe('pre-release-41-1-0_')
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
})
