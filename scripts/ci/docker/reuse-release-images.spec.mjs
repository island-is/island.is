import { describe, expect, jest, test } from '@jest/globals'
import {
  allImagesReused,
  findPreReleaseSourceTags,
  parseChunks,
  prepareReleaseImageReuse,
  setReuseOutputs,
} from './reuse-release-images.mjs'

const webChunk = {
  projects: 'web',
  docker_type: 'docker-next',
  home: 'apps/web',
  dist: 'dist/apps/web',
}
const apiChunk = { ...webChunk, projects: 'api', docker_type: 'docker-express' }
const releaseBranch = 'release/2026.5.26.0'
const dockerTag = 'release_2026.5.26.0_abcd123_random'
const sha = 'abcd123456789000000000000000000000000000'
const sourceTag = 'pre-release-2026-5-26-0_abcd123456_42'

const awsError = (code) => Object.assign(new Error(code), { code })

// images: { [repositoryName]: { [imageTag]: manifest } }
const ecrMock = ({ images = {}, putImage } = {}) => ({
  batchGetImage: jest.fn(({ repositoryName, imageIds }) => ({
    promise: async () => ({
      images: imageIds
        .filter(({ imageTag }) => images[repositoryName]?.[imageTag])
        .map(({ imageTag }) => ({
          imageId: { imageTag },
          imageManifest: images[repositoryName][imageTag],
        })),
    }),
  })),
  putImage: putImage ?? jest.fn(() => ({ promise: async () => ({}) })),
})

const reusedWeb = {
  value: 'build',
  project: 'web',
  target: 'output-next',
  imageName: 'web',
  imageTag: dockerTag,
  sourceTag,
}

describe('reuse-release-images.mjs', () => {
  test('parses docker chunks with existing single-quoted output shape', () => {
    expect(parseChunks(`'${JSON.stringify([webChunk])}'`)).toEqual([webChunk])
  })

  describe('allImagesReused', () => {
    test('only when there were images and none is left to build', () => {
      expect(
        allImagesReused({ buildChunks: [], reusedDockerData: [reusedWeb] }),
      ).toBe(true)
      expect(
        allImagesReused({
          buildChunks: [apiChunk],
          reusedDockerData: [reusedWeb],
        }),
      ).toBe(false)
      // Nothing was reused, e.g. the commit has no pre-release run
      expect(
        allImagesReused({ buildChunks: [webChunk], reusedDockerData: [] }),
      ).toBe(false)
      expect(allImagesReused({ buildChunks: [], reusedDockerData: [] })).toBe(
        false,
      )
    })

    test('is given to the workflow as a string', () => {
      const outputs = {}
      const coreApi = { setOutput: (key, value) => (outputs[key] = value) }

      setReuseOutputs(coreApi, {
        buildChunks: [],
        reusedDockerData: [reusedWeb],
      })
      expect(outputs.ALL_IMAGES_REUSED).toBe('true')
      expect(outputs.BUILD_CHUNKS).toBe('[]')

      setReuseOutputs(coreApi, {
        buildChunks: [apiChunk],
        reusedDockerData: [reusedWeb],
      })
      expect(outputs.ALL_IMAGES_REUSED).toBe('false')
    })
  })

  describe('findPreReleaseSourceTags', () => {
    const octokitMock = (workflow_runs) => ({
      request: jest.fn(async () => ({ data: { workflow_runs } })),
    })
    const run = (run_number, overrides = {}) => ({
      run_number,
      head_sha: sha,
      head_branch: 'pre-release/2026.5.26.0',
      ...overrides,
    })

    test('builds push.yml tags for runs of the released commit, newest first', async () => {
      const octokit = octokitMock([run(41), run(42)])

      await expect(
        findPreReleaseSourceTags({
          octokit,
          owner: 'island-is',
          repo: 'island.is',
          releaseBranch,
          sha,
        }),
      ).resolves.toEqual([
        'pre-release-2026-5-26-0_abcd123456_42',
        'pre-release-2026-5-26-0_abcd123456_41',
      ])
      expect(octokit.request).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          workflow_id: 'push.yml',
          branch: 'pre-release/2026.5.26.0',
          head_sha: sha,
        }),
      )
    })

    test('looks up another workflow, branch and tag prefix when told to', async () => {
      const octokit = octokitMock([run(7, { head_branch: 'my-pr-branch' })])

      await expect(
        findPreReleaseSourceTags({
          octokit,
          owner: 'island-is',
          repo: 'island.is',
          releaseBranch,
          sha,
          workflow: 'test-pre-release.yml',
          preReleaseBranch: 'my-pr-branch',
          tagPrefix: 'test-pre-release-2026-5-26-0_',
        }),
      ).resolves.toEqual(['test-pre-release-2026-5-26-0_abcd123456_7'])
      expect(octokit.request).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          workflow_id: 'test-pre-release.yml',
          branch: 'my-pr-branch',
        }),
      )
    })

    test('ignores runs of other commits and branches', async () => {
      const octokit = octokitMock([
        run(1, { head_sha: 'ffff' }),
        run(2, { head_branch: 'pre-release/2026.5.19.0' }),
      ])

      await expect(
        findPreReleaseSourceTags({
          octokit,
          owner: 'island-is',
          repo: 'island.is',
          releaseBranch,
          sha,
        }),
      ).resolves.toEqual([])
    })
  })

  describe('prepareReleaseImageReuse', () => {
    test('builds everything when the commit has no pre-release run', async () => {
      const ecr = ecrMock({ images: { web: { [sourceTag]: '{manifest}' } } })

      await expect(
        prepareReleaseImageReuse({
          ecr,
          releaseBranch,
          dockerTag,
          chunks: [webChunk],
          sourceTags: [],
        }),
      ).resolves.toEqual({ buildChunks: [webChunk], reusedDockerData: [] })
      expect(ecr.putImage).not.toHaveBeenCalled()
    })

    test('builds everything when not on a release branch', async () => {
      const ecr = ecrMock({ images: { web: { [sourceTag]: '{manifest}' } } })

      await expect(
        prepareReleaseImageReuse({
          ecr,
          releaseBranch: 'main',
          dockerTag,
          chunks: [webChunk],
          sourceTags: [sourceTag],
        }),
      ).resolves.toEqual({ buildChunks: [webChunk], reusedDockerData: [] })
      expect(ecr.putImage).not.toHaveBeenCalled()
    })

    test('retags image of the released commit and filters build chunks', async () => {
      const ecr = ecrMock({ images: { web: { [sourceTag]: '{manifest}' } } })

      await expect(
        prepareReleaseImageReuse({
          ecr,
          releaseBranch,
          dockerTag,
          chunks: [webChunk, apiChunk],
          sourceTags: [sourceTag],
        }),
      ).resolves.toEqual({
        // api has no image for this commit, e.g. its pre-release build failed
        buildChunks: [apiChunk],
        reusedDockerData: [reusedWeb],
      })
      expect(ecr.putImage).toHaveBeenCalledTimes(1)
      expect(ecr.putImage).toHaveBeenCalledWith({
        repositoryName: 'web',
        imageManifest: '{manifest}',
        imageTag: dockerTag,
      })
    })

    test('never reuses an image from another commit', async () => {
      const ecr = ecrMock({
        images: { web: { 'pre-release-2026-5-26-0_0000000000_41': '{old}' } },
      })

      await expect(
        prepareReleaseImageReuse({
          ecr,
          releaseBranch,
          dockerTag,
          chunks: [webChunk],
          sourceTags: [sourceTag],
        }),
      ).resolves.toEqual({ buildChunks: [webChunk], reusedDockerData: [] })
      expect(ecr.putImage).not.toHaveBeenCalled()
    })

    test('builds only the failing image when retagging fails', async () => {
      const warn = jest.fn()
      const ecr = ecrMock({
        images: {
          web: { [sourceTag]: '{manifest}' },
          api: { [sourceTag]: '{manifest}' },
        },
        putImage: jest.fn(({ repositoryName }) => ({
          promise: async () => {
            if (repositoryName === 'api') {
              throw awsError('AccessDeniedException')
            }
            return {}
          },
        })),
      })

      await expect(
        prepareReleaseImageReuse({
          ecr,
          releaseBranch,
          dockerTag,
          chunks: [apiChunk, webChunk],
          sourceTags: [sourceTag],
          warn,
        }),
      ).resolves.toEqual({
        buildChunks: [apiChunk],
        reusedDockerData: [reusedWeb],
      })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('api'))
    })

    test('keeps chunk order with many chunks in flight', async () => {
      const chunks = Array.from({ length: 30 }, (_, i) => ({
        ...webChunk,
        projects: `app-${i}`,
      }))
      const images = Object.fromEntries(
        chunks
          .filter((_, i) => i % 2 === 0)
          .map((chunk) => [chunk.projects, { [sourceTag]: '{manifest}' }]),
      )

      const result = await prepareReleaseImageReuse({
        ecr: ecrMock({ images }),
        releaseBranch,
        dockerTag,
        chunks,
        sourceTags: [sourceTag],
      })

      expect(result.buildChunks).toEqual(chunks.filter((_, i) => i % 2 === 1))
      expect(result.reusedDockerData.map(({ project }) => project)).toEqual(
        chunks.filter((_, i) => i % 2 === 0).map((chunk) => chunk.projects),
      )
    })
  })
})
