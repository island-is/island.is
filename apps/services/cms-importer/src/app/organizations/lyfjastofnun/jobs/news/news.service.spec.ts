import { CmsRepository } from '../../../../platform/cms.repository'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { LyfjastofnunNewsImportService } from './news.service'
import { buildNewsEntry } from './news.mapper'

describe('required news image assignments', () => {
  const cms = {
    getContentByTypeAndLinkedEntry: jest.fn(),
    requireImageAsset: jest.fn(),
    createEntries: jest.fn(),
  }
  const source = { getPosts: jest.fn(), scrapePostSummary: jest.fn() }
  const service = new LyfjastofnunNewsImportService(
    cms as unknown as CmsRepository,
    source as unknown as LyfjastofnunRepository,
  )
  const post = {
    id: 1,
    slug: 'news-post',
    date: '2026-11-01',
    link: 'https://example.com/news',
    title: { rendered: 'News' },
    content: {
      rendered: '<p>Content</p><img src="https://example.com/source.jpg">',
    },
  }

  beforeEach(() => {
    jest.resetAllMocks()
    source.getPosts.mockResolvedValue([post])
    source.scrapePostSummary.mockResolvedValue(null)
    cms.getContentByTypeAndLinkedEntry.mockResolvedValue([])
    cms.requireImageAsset.mockResolvedValue(undefined)
    cms.createEntries.mockResolvedValue([])
  })

  it.each(['', '   '])(
    'rejects blank image references in the shared news mapper',
    (assetId) => {
      expect(() => buildNewsEntry(post, assetId)).toThrow(
        'Imported news requires an image asset ID',
      )
    },
  )

  it('requires an explicit asset assignment even when the source contains an image', async () => {
    await expect(service.run({ imageAssetIdsBySlug: {} })).rejects.toThrow(
      'Missing image asset assignment for news post: news-post',
    )
    expect(cms.createEntries).not.toHaveBeenCalled()
  })

  it('validates and references the supplied collection asset', async () => {
    await service.run({
      imageAssetIdsBySlug: { 'news-post': 'chosen-asset' },
      publish: true,
    })
    expect(cms.requireImageAsset).toHaveBeenCalledWith('chosen-asset', true)
    expect(cms.createEntries).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          fields: expect.objectContaining({
            image: {
              'is-IS': { sys: { id: 'chosen-asset', linkType: 'Asset' } },
            },
          }),
        }),
      ],
      'news',
      true,
    )
  })

  it('creates no entries if a later post has no assigned image', async () => {
    source.getPosts.mockResolvedValue([
      post,
      { ...post, slug: 'missing-image' },
    ])
    await expect(
      service.run({ imageAssetIdsBySlug: { 'news-post': 'chosen-asset' } }),
    ).rejects.toThrow('missing-image')
    expect(cms.createEntries).not.toHaveBeenCalled()
  })

  it('does not require assignments for existing news entries', async () => {
    cms.getContentByTypeAndLinkedEntry.mockResolvedValue([
      { fields: { slug: { 'is-IS': post.slug } } },
    ])
    await service.run({ imageAssetIdsBySlug: {} })
    expect(cms.requireImageAsset).not.toHaveBeenCalled()
    expect(cms.createEntries).not.toHaveBeenCalled()
  })

  it('stops when the assigned asset is invalid', async () => {
    cms.requireImageAsset.mockRejectedValue(new Error('Invalid image'))
    await expect(
      service.run({ imageAssetIdsBySlug: { 'news-post': 'bad-asset' } }),
    ).rejects.toThrow('Invalid image')
    expect(cms.createEntries).not.toHaveBeenCalled()
  })
})
