import { describe, expect, jest, test } from '@jest/globals'
import { findImage, retagImage } from './ecr-images.mjs'

const MEDIA_TYPE = 'application/vnd.oci.image.index.v1+json'

const awsError = (code) => Object.assign(new Error(code), { code })

const ecrMock = ({ manifests = {}, putImage, batchGetImage } = {}) => ({
  batchGetImage:
    batchGetImage ??
    jest.fn(({ imageIds }) => ({
      promise: async () => ({
        images: imageIds
          .filter(({ imageTag }) => manifests[imageTag])
          .map(({ imageTag }) => ({
            imageId: { imageTag },
            imageManifest: manifests[imageTag],
            imageManifestMediaType: MEDIA_TYPE,
          }))
          // ECR does not promise to keep the order of the request
          .reverse(),
      }),
    })),
  putImage: putImage ?? jest.fn(() => ({ promise: async () => ({}) })),
})

describe('ecr-images.mjs', () => {
  test('finds image for exact tag with its media type', async () => {
    const ecr = ecrMock({ manifests: { source: '{manifest}' } })

    await expect(findImage(ecr, 'web', ['source'])).resolves.toEqual({
      tag: 'source',
      manifest: '{manifest}',
      mediaType: MEDIA_TYPE,
    })
    expect(ecr.batchGetImage).toHaveBeenCalledWith(
      expect.objectContaining({
        repositoryName: 'web',
        imageIds: [{ imageTag: 'source' }],
        acceptedMediaTypes: expect.arrayContaining([MEDIA_TYPE]),
      }),
    )
  })

  test('prefers the first tag given, in a single request', async () => {
    const ecr = ecrMock({ manifests: { old: '{old}', new: '{new}' } })

    await expect(findImage(ecr, 'web', ['new', 'old'])).resolves.toMatchObject({
      tag: 'new',
      manifest: '{new}',
    })
    expect(ecr.batchGetImage).toHaveBeenCalledTimes(1)
  })

  test('returns undefined when no tag exists', async () => {
    await expect(findImage(ecrMock(), 'web', ['missing'])).resolves.toBe(
      undefined,
    )
  })

  test('missing repository is treated as no reusable image', async () => {
    const ecr = ecrMock({
      batchGetImage: jest.fn(() => ({
        promise: async () => {
          throw awsError('RepositoryNotFoundException')
        },
      })),
    })

    await expect(findImage(ecr, 'missing', ['source'])).resolves.toBe(undefined)
  })

  test('other lookup errors are thrown', async () => {
    const ecr = ecrMock({
      batchGetImage: jest.fn(() => ({
        promise: async () => {
          throw awsError('AccessDeniedException')
        },
      })),
    })

    await expect(findImage(ecr, 'web', ['source'])).rejects.toThrow(
      'AccessDeniedException',
    )
  })

  test('retags with the manifest and media type of the source', async () => {
    const ecr = ecrMock()

    await retagImage(
      ecr,
      'web',
      { tag: 'source', manifest: '{manifest}', mediaType: MEDIA_TYPE },
      'target',
    )

    expect(ecr.putImage).toHaveBeenCalledWith({
      repositoryName: 'web',
      imageManifest: '{manifest}',
      imageManifestMediaType: MEDIA_TYPE,
      imageTag: 'target',
    })
  })

  test('already retagged image is not an error', async () => {
    const ecr = ecrMock({
      putImage: jest.fn(() => ({
        promise: async () => {
          throw awsError('ImageAlreadyExistsException')
        },
      })),
    })

    await expect(
      retagImage(ecr, 'web', { manifest: '{manifest}' }, 'target'),
    ).resolves.toBe(undefined)
  })

  test('error is ignored when the target tag ended up on our image', async () => {
    const ecr = ecrMock({
      manifests: { target: '{manifest}' },
      putImage: jest.fn(() => ({
        promise: async () => {
          throw awsError('TimeoutError')
        },
      })),
    })

    await expect(
      retagImage(ecr, 'web', { manifest: '{manifest}' }, 'target'),
    ).resolves.toBe(undefined)
  })

  test('throws when the target tag belongs to another image', async () => {
    const ecr = ecrMock({
      manifests: { target: '{other}' },
      putImage: jest.fn(() => ({
        promise: async () => {
          throw awsError('ImageTagAlreadyExistsException')
        },
      })),
    })

    await expect(
      retagImage(ecr, 'web', { manifest: '{manifest}' }, 'target'),
    ).rejects.toThrow('ImageTagAlreadyExistsException')
  })
})
