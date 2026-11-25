import { CmsRepository } from './cms.repository'
import { ManagementClientService } from '../repositories/cms/managementClient/managementClient.service'
import { LOCALE } from '../constants'

describe('asset reuse across importer jobs', () => {
  const getAssets = jest.fn()
  const repository = new CmsRepository({
    getAssets,
  } as unknown as ManagementClientService)

  beforeEach(() => getAssets.mockReset())

  it('finds an asset beyond the first page instead of uploading a duplicate', async () => {
    const asset = { fields: { file: { [LOCALE]: { fileName: 'treaty.pdf' } } } }
    getAssets
      .mockResolvedValueOnce({
        ok: true,
        data: {
          items: Array.from({ length: 1000 }, () => ({ fields: {} })),
          total: 1001,
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: { items: [asset], total: 1001 },
      })

    await expect(repository.findAssetByFileName('treaty.pdf')).resolves.toBe(
      asset,
    )
    expect(getAssets).toHaveBeenLastCalledWith({
      order: 'sys.id',
      limit: 1000,
      skip: 1000,
    })
  })

  it('stops on a failed lookup rather than treating it as a missing asset', async () => {
    getAssets.mockResolvedValue({ ok: false, error: new Error('Unavailable') })
    await expect(repository.findAssetByFileName('treaty.pdf')).rejects.toThrow(
      'Failed to look up asset',
    )
  })

  it.each([
    [],
    [
      {
        fields: {
          file: {
            [LOCALE]: {
              contentType: 'application/pdf',
              url: '//files/document.pdf',
            },
          },
        },
      },
    ],
    [{ fields: { file: { [LOCALE]: { contentType: 'image/jpeg' } } } }],
  ])('rejects missing or unusable image assets', async (...items) => {
    getAssets.mockResolvedValue({ ok: true, data: { items } })
    await expect(repository.requireImageAsset('image')).rejects.toThrow(
      'not a processed image',
    )
  })

  it('accepts an existing processed image for draft news', async () => {
    getAssets.mockResolvedValue({
      ok: true,
      data: {
        items: [
          {
            fields: {
              file: {
                [LOCALE]: {
                  contentType: 'image/jpeg',
                  url: '//files/image.jpg',
                },
              },
            },
          },
        ],
      },
    })
    await expect(repository.requireImageAsset('image')).resolves.toBeUndefined()
    expect(getAssets).toHaveBeenCalledWith({ 'sys.id': 'image', limit: 1 })
  })

  it.each([
    [false, false],
    [true, true],
    [true, false],
  ])(
    'requires an already published, unchanged image for published news (%s, %s)',
    async (published, updated) => {
      getAssets.mockResolvedValue({
        ok: true,
        data: {
          items: [
            {
              fields: {
                file: {
                  [LOCALE]: {
                    contentType: 'image/jpeg',
                    url: '//files/image.jpg',
                  },
                },
              },
              isPublished: () => published,
              isUpdated: () => updated,
            },
          ],
        },
      })
      const result = repository.requireImageAsset('image', true)
      if (published && !updated) {
        await expect(result).resolves.toBeUndefined()
      } else {
        await expect(result).rejects.toThrow('Publish the news image asset')
      }
    },
  )
})
