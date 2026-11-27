import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { LOCALE, EN_LOCALE } from '../../../../constants'
import { generateGenericListItem } from '../../../../platform/content-types/generic-list-item.mapper'
import {
  hasUniformLinkType,
  isSimpleShape,
  mapEntryCreationDto,
} from './treaties.mapper'

describe('RSK treaty mapping through the shared CMS mapper', () => {
  it('keeps separate Icelandic and English asset references', () => {
    const entry = mapEntryCreationDto({
      name: 'Danmörk',
      tabKeys: ['samningar'],
      documents: [
        {
          links: [
            {
              kind: 'is',
              label: 'íslensku',
              resolved: { type: 'asset', assetId: 'asset-is' },
            },
            {
              kind: 'en',
              label: 'ensku',
              resolved: { type: 'asset', assetId: 'asset-en' },
            },
          ],
        },
      ],
    })

    expect(entry?.fields.asset).toEqual({
      [LOCALE]: { sys: { id: 'asset-is', linkType: 'Asset' } },
      [EN_LOCALE]: { sys: { id: 'asset-en', linkType: 'Asset' } },
    })
    expect(entry?.fields.content).toBeUndefined()
  })

  it('keeps localized external links as entry references', () => {
    const entry = mapEntryCreationDto({
      name: 'Danmörk',
      tabKeys: ['samningar'],
      documents: [
        {
          links: [
            {
              kind: 'is',
              label: 'íslensku',
              resolved: {
                type: 'externalLinkEntry',
                entryId: 'link-is',
                url: 'https://example.is/is',
              },
            },
            {
              kind: 'en',
              label: 'ensku',
              resolved: {
                type: 'externalLinkEntry',
                entryId: 'link-en',
                url: 'https://example.is/en',
              },
            },
          ],
        },
      ],
    })

    expect(entry?.fields.externalLink).toEqual({
      [LOCALE]: { sys: { id: 'link-is', linkType: 'Entry' } },
      [EN_LOCALE]: { sys: { id: 'link-en', linkType: 'Entry' } },
    })
  })

  it('maps an English-only row as content so its link is kept', () => {
    const item = {
      name: 'Danmörk',
      tabKeys: ['upplysingaskipti' as const],
      documents: [
        {
          links: [
            {
              kind: 'en' as const,
              label: 'ensku',
              resolved: { type: 'asset' as const, assetId: 'asset-en' },
            },
          ],
        },
      ],
    }

    expect(isSimpleShape(item)).toBe(false)
    const entry = mapEntryCreationDto(item)
    expect(entry?.fields.asset).toBeUndefined()
    expect(JSON.stringify(entry?.fields.content)).toContain('asset-en')
  })

  it('keeps both targets when the languages resolve to different link types', () => {
    const document = {
      links: [
        {
          kind: 'is' as const,
          label: 'íslensku',
          resolved: { type: 'asset' as const, assetId: 'asset-is' },
        },
        {
          kind: 'en' as const,
          label: 'ensku',
          resolved: {
            type: 'externalLinkEntry' as const,
            entryId: 'link-en',
            url: 'https://example.is/en',
          },
        },
      ],
    }

    expect(hasUniformLinkType(document)).toBe(false)
    const entry = mapEntryCreationDto(
      { name: 'Danmörk', tabKeys: ['samningar'], documents: [document] },
      false,
    )
    const content = JSON.stringify(entry?.fields.content)
    expect(content).toContain('asset-is')
    expect(content).toContain('https://example.is/en')
  })

  it('preserves asset and URL hyperlinks in multi-document rich text', () => {
    const entry = mapEntryCreationDto({
      name: 'Danmörk',
      tabKeys: ['samningar'],
      documents: [
        {
          label: 'Samningur',
          links: [
            {
              kind: 'is',
              label: 'íslensku',
              resolved: { type: 'asset', assetId: 'treaty' },
            },
          ],
        },
        {
          label: 'Viðauki',
          links: [
            {
              kind: 'other',
              label: 'dönsku',
              resolved: {
                type: 'hyperlink',
                url: 'https://example.com/addendum',
              },
            },
          ],
        },
      ],
    })

    const content = entry?.fields.content[LOCALE]
    expect(content.nodeType).toBe(BLOCKS.DOCUMENT)
    expect(content.content[0].content[0].marks).toEqual([{ type: 'bold' }])
    expect(content.content[1].content[0]).toMatchObject({
      nodeType: INLINES.ASSET_HYPERLINK,
      data: { target: { sys: { id: 'treaty', linkType: 'Asset' } } },
    })
    expect(content.content[3].content[0]).toMatchObject({
      nodeType: INLINES.HYPERLINK,
      data: { uri: 'https://example.com/addendum' },
    })
    expect(entry?.fields.content[EN_LOCALE]).toEqual(content)
  })

  it('still maps Lyfjastofnun plain paragraphs and string asset IDs', () => {
    const entry = generateGenericListItem({
      listId: 'forms',
      ownerTags: [],
      properties: {
        internalTitle: 'Form',
        title: { [LOCALE]: 'Eyðublað' },
        slug: { [LOCALE]: 'eydublad' },
        assetId: 'form',
        content: { [LOCALE]: [{ values: [{ value: 'Lýsing' }] }] },
      },
    })

    expect(entry?.fields.asset[LOCALE].sys.id).toBe('form')
    expect(entry?.fields.content[LOCALE].content[0].content[0]).toEqual({
      nodeType: 'text',
      data: {},
      marks: [],
      value: 'Lýsing',
    })
  })
})
