import { describe, expect, jest, test } from '@jest/globals'
import {
  findLatestImageTag,
  getImageManifest,
  retagImage,
} from './ecr-images.mjs'

const ecrMock = ({ pages = [{}], manifests = {}, putImage } = {}) => ({
  describeImages: jest.fn(({ nextToken }) => ({
    promise: async () => pages[nextToken ? Number(nextToken) : 0],
  })),
  batchGetImage: jest.fn(({ imageIds }) => ({
    promise: async () => {
      const manifest = manifests[imageIds[0].imageTag]
      return manifest ? { images: [{ imageManifest: manifest }] } : { images: [] }
    },
  })),
  putImage: putImage ?? jest.fn(() => ({ promise: async () => ({}) })),
})

describe('ecr-images.mjs', () => {
  test('finds latest image tag matching prefix across pages', async () => {
    const ecr = ecrMock({
      pages: [
        {
          nextToken: '1',
          imageDetails: [
            {
              imageTags: ['pre-release-2026-5-26-0_old'],
              imagePushedAt: new Date('2026-05-01'),
            },
          ],
        },
        {
          imageDetails: [
            {
              imageTags: ['other', 'pre-release-2026-5-26-0_new'],
              imagePushedAt: new Date('2026-05-02'),
            },
          ],
        },
      ],
    })

    await expect(
      findLatestImageTag(ecr, 'web', 'pre-release-2026-5-26-0_'),
    ).resolves.toBe('pre-release-2026-5-26-0_new')
  })

  test('gets image manifest for exact tag', async () => {
    const ecr = ecrMock({ manifests: { source: '{manifest}' } })

    await expect(getImageManifest(ecr, 'web', 'source')).resolves.toBe(
      '{manifest}',
    )
  })

  test('missing repository is treated as no reusable tag', async () => {
    const ecr = {
      describeImages: jest.fn(() => ({
        promise: async () => {
          const error = new Error('missing')
          error.code = 'RepositoryNotFoundException'
          throw error
        },
      })),
    }

    await expect(findLatestImageTag(ecr, 'missing', 'prefix_')).resolves.toBe(
      undefined,
    )
  })

  test('retags source manifest when target does not exist', async () => {
    const putImage = jest.fn(() => ({ promise: async () => ({}) }))
    const ecr = ecrMock({ manifests: { source: '{manifest}' }, putImage })

    await expect(retagImage(ecr, 'web', 'source', 'target')).resolves.toEqual({
      reused: true,
      targetExisted: false,
    })
    expect(putImage).toHaveBeenCalledWith({
      repositoryName: 'web',
      imageManifest: '{manifest}',
      imageTag: 'target',
    })
  })

  test('treats existing target tag as successful reuse', async () => {
    const putImage = jest.fn()
    const ecr = ecrMock({ manifests: { target: '{manifest}' }, putImage })

    await expect(retagImage(ecr, 'web', 'source', 'target')).resolves.toEqual({
      reused: true,
      targetExisted: true,
    })
    expect(putImage).not.toHaveBeenCalled()
  })
})
