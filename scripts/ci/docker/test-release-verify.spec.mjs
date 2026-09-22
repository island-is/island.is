import { describe, expect, jest, test } from '@jest/globals'
import { verifyReuse } from './test-release-verify.mjs'

const chunk = (projects) => ({ projects, docker_type: 'docker-next' })
const preReleaseTag = 'pre-release-2026-9-8-412_abcd123456_412'
const releaseTag = 'release_2026.9.8.412_abcd123_test1a1'

// images: { [repositoryName]: { [imageTag]: digest } }
const ecrMock = (images) => ({
  batchGetImage: jest.fn(({ repositoryName, imageIds }) => ({
    promise: async () => {
      const imageDigest = images[repositoryName]?.[imageIds[0].imageTag]
      return { images: imageDigest ? [{ imageId: { imageDigest } }] : [] }
    },
  })),
})

const reusedWeb = {
  project: 'web',
  imageName: 'web',
  imageTag: releaseTag,
  sourceTag: preReleaseTag,
}
const input = (overrides = {}) => ({
  ecr: ecrMock({
    web: { [preReleaseTag]: 'sha256:web', [releaseTag]: 'sha256:web' },
  }),
  chunks: [chunk('web'), chunk('api')],
  buildChunks: [chunk('api')],
  reusedDockerData: [reusedWeb],
  preReleaseTag,
  releaseTag,
  ...overrides,
})

describe('test-release-verify.mjs', () => {
  test('passes when the image with a pre-release tag was retagged', async () => {
    await expect(verifyReuse(input())).resolves.toEqual([])
  })

  test('fails when the release tag is on another image', async () => {
    const ecr = ecrMock({
      web: { [preReleaseTag]: 'sha256:web', [releaseTag]: 'sha256:other' },
    })

    const errors = await verifyReuse(input({ ecr }))
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('sha256:other')
  })

  test('fails when an image that could be reused is left to build', async () => {
    const errors = await verifyReuse(
      input({
        buildChunks: [chunk('web'), chunk('api')],
        reusedDockerData: [],
      }),
    )
    expect(errors).toEqual([
      'Reused [], expected [web]',
      'Left [web,api] to build, expected [api]',
    ])
  })

  test('fails when an image without a pre-release tag was "reused"', async () => {
    const errors = await verifyReuse(
      input({
        buildChunks: [],
        reusedDockerData: [reusedWeb, { ...reusedWeb, project: 'api' }],
      }),
    )
    expect(errors).toEqual(
      expect.arrayContaining(['Reused [web,api], expected [web]']),
    )
  })

  test('fails when the test does not cover both outcomes', async () => {
    const errors = await verifyReuse(
      input({ chunks: [chunk('web')], buildChunks: [] }),
    )
    expect(errors).toEqual([
      'Every project has a pre-release image, expected one without',
    ])
  })
})
