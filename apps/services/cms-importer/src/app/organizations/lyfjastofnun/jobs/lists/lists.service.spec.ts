import { LOCALE, EN_LOCALE } from '../../../../constants'
import { CmsRepository } from '../../../../platform/cms.repository'
import { EntryCreationDto } from '../../../../platform/cms.types'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { LyfjastofnunScrapedItem } from '../../lyfjastofnun.types'
import { LyfjastofnunListsImportService } from './lists.service'

describe('Lyfjastofnun lists import', () => {
  const title = 'Same title'
  const firstUrl = 'https://example.com/first'
  const secondUrl = 'https://example.com/second'
  const externalItem = (externalUrl: string): LyfjastofnunScrapedItem => ({
    title,
    titleEn: 'Same English title',
    groupTitle: '',
    externalUrl,
  })

  const entryWith = (slug: string, field: string, id: string) => ({
    sys: { id: slug },
    fields: {
      slug: { [LOCALE]: slug },
      [field]: { [LOCALE]: { sys: { id } } },
    },
  })

  const setup = (items: LyfjastofnunScrapedItem[]) => {
    const getLists = jest.fn().mockResolvedValue(items)
    const getGenericListItemEntries = jest.fn().mockResolvedValue([])
    const getAssetFileName = jest.fn()
    const findAssetByFileName = jest.fn()
    const createEntries = jest.fn().mockResolvedValue([])
    const getContentByType = jest.fn().mockResolvedValue(
      [firstUrl, secondUrl].map((url, index) => ({
        sys: { id: String(index) },
        fields: { url: { [LOCALE]: url } },
      })),
    )

    const service = new LyfjastofnunListsImportService(
      {
        getGenericListItemEntries,
        getContentByType,
        getAssetFileName,
        findAssetByFileName,
        createEntries,
      } as unknown as CmsRepository,
      { getLists } as unknown as LyfjastofnunRepository,
    )

    return {
      service,
      getLists,
      getGenericListItemEntries,
      getAssetFileName,
      findAssetByFileName,
      createEntries,
    }
  }

  it('imports distinct links with the same title and skips both on reordered reruns', async () => {
    const items = [externalItem(firstUrl), externalItem(secondUrl)]
    const { service, getLists, getGenericListItemEntries, createEntries } =
      setup([...items, items[0]])

    await service.run()

    const created: EntryCreationDto[] = createEntries.mock.calls[0][0]
    expect(created).toHaveLength(2)
    expect(new Set(created.map((dto) => dto.fields.slug[LOCALE])).size).toBe(2)
    expect(new Set(created.map((dto) => dto.fields.slug[EN_LOCALE])).size).toBe(
      2,
    )

    const reversed = [...items].reverse()
    const freshRun = setup(reversed)
    await freshRun.service.run()
    expect(freshRun.createEntries.mock.calls[0][0]).toEqual(
      [...created].reverse(),
    )

    getLists.mockResolvedValue(reversed)
    getGenericListItemEntries.mockResolvedValue(
      created.map(({ fields }) => ({ fields })),
    )
    await service.run()

    expect(createEntries).toHaveBeenCalledTimes(1)
  })

  it('keeps a legacy slug matched by its external link and creates only the other item', async () => {
    const { service, getGenericListItemEntries, createEntries } = setup([
      externalItem(firstUrl),
      externalItem(secondUrl),
    ])
    getGenericListItemEntries.mockResolvedValue([
      entryWith('same-title', 'externalLink', '0'),
    ])

    await service.run({ limit: 1 })

    const created: EntryCreationDto[] = createEntries.mock.calls[0][0]
    expect(created).toHaveLength(1)
    expect(created[0].fields.externalLink[LOCALE].sys.id).toBe('1')
    expect(created[0].fields.slug[LOCALE]).not.toBe('same-title')
  })

  it('keeps a legacy asset matched by its filename and creates only the other item', async () => {
    const {
      service,
      getGenericListItemEntries,
      getAssetFileName,
      createEntries,
    } = setup([
      { title, groupTitle: '', fileUrl: 'https://example.com/legacy.pdf' },
      externalItem(secondUrl),
    ])
    getGenericListItemEntries.mockResolvedValue([
      entryWith('same-title', 'asset', 'legacy-asset'),
    ])
    getAssetFileName.mockResolvedValue('legacy.pdf')

    await service.run()

    expect(getAssetFileName).toHaveBeenCalledWith('legacy-asset')
    const created: EntryCreationDto[] = createEntries.mock.calls[0][0]
    expect(created).toHaveLength(1)
    expect(created[0].fields.externalLink[LOCALE].sys.id).toBe('1')
  })

  it('avoids duplicates when a legacy filename matches two source documents', async () => {
    const {
      service,
      getGenericListItemEntries,
      getAssetFileName,
      createEntries,
    } = setup([
      { title, groupTitle: '', fileUrl: 'https://example.com/a/list.pdf' },
      { title, groupTitle: '', fileUrl: 'https://example.com/b/list.pdf' },
    ])
    getGenericListItemEntries.mockResolvedValue([
      entryWith('same-title', 'asset', 'legacy-asset'),
    ])
    getAssetFileName.mockResolvedValue('list.pdf')

    await service.run()

    expect(createEntries).not.toHaveBeenCalled()
  })
})
