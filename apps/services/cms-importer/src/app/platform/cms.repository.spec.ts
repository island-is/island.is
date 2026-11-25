import { CmsRepository } from './cms.repository'
import { ManagementClientService } from './managementClient/managementClient.service'
import { LOCALE } from '../constants'

describe('asset reuse across importer jobs', () => {
  const getAssets = jest.fn()
  const repository = new CmsRepository(({
    getAssets,
  } as unknown) as ManagementClientService)

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
})
