import { describe, expect, jest, test } from '@jest/globals'
import {
  parseChunks,
  prepareReleaseImageReuse,
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

const ecrMock = ({ imageDetails = {}, manifests = {} } = {}) => ({
  describeImages: jest.fn(({ repositoryName }) => ({
    promise: async () => ({ imageDetails: imageDetails[repositoryName] ?? [] }),
  })),
  batchGetImage: jest.fn(({ imageIds }) => ({
    promise: async () => {
      const manifest = manifests[imageIds[0].imageTag]
      return manifest
        ? { images: [{ imageManifest: manifest }] }
        : { images: [] }
    },
  })),
  putImage: jest.fn(() => ({ promise: async () => ({}) })),
})

const detail = (tag, date) => ({
  imageTags: [tag],
  imagePushedAt: new Date(date),
})

describe('reuse-release-images.mjs', () => {
  test('parses docker chunks with existing single-quoted output shape', () => {
    expect(parseChunks(`'${JSON.stringify([webChunk])}'`)).toEqual([webChunk])
  })

  test('leaves chunks unchanged when release web tag exists', async () => {
    const ecr = ecrMock({
      imageDetails: {
        web: [detail('release_2026.5.26.0_existing', '2026-05-03')],
      },
    })

    await expect(
      prepareReleaseImageReuse({
        ecr,
        releaseBranch,
        dockerTag,
        chunks: [webChunk],
      }),
    ).resolves.toEqual({
      initialReleaseRun: false,
      buildChunks: [webChunk],
      reusedDockerData: [],
    })
  })

  test('retags latest per-image pre-release tag and filters build chunks', async () => {
    const ecr = ecrMock({
      imageDetails: {
        web: [
          detail('pre-release-2026-5-26-0_old', '2026-05-01'),
          detail('pre-release-2026-5-26-0_new', '2026-05-02'),
        ],
      },
      manifests: { 'pre-release-2026-5-26-0_new': '{manifest}' },
    })

    const result = await prepareReleaseImageReuse({
      ecr,
      releaseBranch,
      dockerTag,
      chunks: [webChunk],
    })

    expect(result).toEqual({
      initialReleaseRun: true,
      buildChunks: [],
      reusedDockerData: [
        {
          value: 'build',
          project: 'web',
          target: 'output-next',
          imageName: 'web',
          imageTag: dockerTag,
        },
      ],
    })
    expect(ecr.putImage).toHaveBeenCalledWith({
      repositoryName: 'web',
      imageManifest: '{manifest}',
      imageTag: dockerTag,
    })
  })

  test('keeps image in build chunks when no pre-release tag exists', async () => {
    const ecr = ecrMock()

    await expect(
      prepareReleaseImageReuse({
        ecr,
        releaseBranch,
        dockerTag,
        chunks: [apiChunk],
      }),
    ).resolves.toEqual({
      initialReleaseRun: true,
      buildChunks: [apiChunk],
      reusedDockerData: [],
    })
  })
})
