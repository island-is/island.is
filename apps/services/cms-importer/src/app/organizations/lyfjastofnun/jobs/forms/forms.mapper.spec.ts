import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { LyfjastofnunScrapedItem } from '../../lyfjastofnun.types'
import { CATEGORY_TAG_IDS } from './constants'
import { resolveCategoryTagId, stripTitleCaveats } from './forms.mapper'

const scraped = (
  overrides: Partial<LyfjastofnunScrapedItem> = {},
): LyfjastofnunScrapedItem => ({
  title: 'Umsókn um lækkun árgjalds',
  groupTitle: 'Eyðublöð vegna leyfisveitinga lyfja',
  categoryTitle: 'Leyfisveiting lyfja',
  fileUrl: 'https://www.lyfjastofnun.is/wp-content/uploads/x.docx',
  ...overrides,
})

describe('resolveCategoryTagId', () => {
  // Every label the live page renders, verbatim. If the page renames one of
  // these, the corresponding item stops resolving and is skipped rather than
  // silently created without a filter tag.
  const labels = [
    'Verð og greiðsluþátttaka',
    'Leyfisveiting lyfja',
    'Apótek',
    'Innflutningur, framleiðsla og heildsöludreifing lyfja',
    'Dýralæknar',
    'Lækningatæki',
    'Öryggisupplýsingar',
    'Lyfjaskortur',
    'Undanþágulyf',
    'Aðgangur að upplýsingum',
    'Innflutningur og útflutningur',
    'Undanþága fyrir almennar verslanir',
  ]

  it.each(labels)('resolves the tag id for %s', (categoryTitle) => {
    expect(resolveCategoryTagId(scraped({ categoryTitle }))).toBe(
      CATEGORY_TAG_IDS[categoryTitle],
    )
  })

  it('covers every configured tag id', () => {
    expect(labels.sort()).toEqual(Object.keys(CATEGORY_TAG_IDS).sort())
  })

  it('returns undefined for an unrecognised label', () => {
    expect(
      resolveCategoryTagId(scraped({ categoryTitle: 'Eitthvað nýtt' })),
    ).toBeUndefined()
  })

  it('returns undefined when the item has no category label', () => {
    expect(
      resolveCategoryTagId(scraped({ categoryTitle: undefined })),
    ).toBeUndefined()
  })

  it('does not fall back to the group heading', () => {
    // "Verð og greiðsluþátttaka lyfja" is the <h2>, not the item label.
    expect(
      resolveCategoryTagId(
        scraped({
          categoryTitle: undefined,
          groupTitle: 'Verð og greiðsluþátttaka lyfja',
        }),
      ),
    ).toBeUndefined()
  })
})

describe('stripTitleCaveats', () => {
  it('strips the "(in Icelandic)" annotation', () => {
    expect(
      stripTitleCaveats(
        'Application for license to manufacture medicinal products (in Icelandic)',
      ),
    ).toBe('Application for license to manufacture medicinal products')
  })

  it('strips the Internet Explorer annotation', () => {
    expect(
      stripTitleCaveats(
        "Manufacturer's incident report (only works in Internet Explorer)",
      ),
    ).toBe("Manufacturer's incident report")
  })

  it('leaves a meaningful trailing parenthetical alone', () => {
    const title =
      'Application for a Certificate of Pharmaceutical Product (Type A)'
    expect(stripTitleCaveats(title)).toBe(title)
  })
})

describe('parsing the category label out of the page markup', () => {
  // Pinned verbatim from https://www.lyfjastofnun.is/utgefid-efni/eydublod/ so
  // the extraction is asserted rather than assumed — the category span sits
  // inside the same region as the title span, and a change in that markup would
  // otherwise silently send every item down the skip path.
  const html = `
<div class="relatedfiles">
  <h2 class="relatedfiles__title">Verð og greiðsluþátttaka lyfja</h2>
  <div class="relatedfiles__wrapper">
    <div class="relatedfiles__item">
      <h3 class="relatedfiles__item__title">
        <span>Umsókn um hámarksheildsöluverð - almenn lyf</span>
        <small>
          <span class="relatedfiles__item__title--filesize">xls, 68 kb</span>
        </small>
        <span class="relatedfiles__item__category">Verð og greiðsluþátttaka</span>
      </h3>
      <div class="relatedfiles__item__icon">
        <a href="https://www.lyfjastofnun.is/wp-content/uploads/a.xls" class="relatedfiles__item__download">Hlaða niður</a>
      </div>
    </div>
    <div class="relatedfiles__item">
      <h3 class="relatedfiles__item__title">
        <span>Umsókn um endurbirtingu upplýsinga í lyfjaverðskrá</span>
        <span class="relatedfiles__item__category">Verð og greiðsluþátttaka</span>
      </h3>
      <div class="relatedfiles__item__icon">
        <a href="https://island.is/endurbirting" class="relatedfiles__item__open">Opna</a>
      </div>
    </div>
  </div>
</div>`

  const parse = (): LyfjastofnunScrapedItem[] =>
    new LyfjastofnunRepository()['parsePage'](html)

  it('reads the per-item category label, not the group heading', () => {
    const [first] = parse()
    expect(first.categoryTitle).toBe('Verð og greiðsluþátttaka')
    expect(first.groupTitle).toBe('Verð og greiðsluþátttaka lyfja')
  })

  it('keeps the title span, which precedes the category span', () => {
    expect(parse().map((item) => item.title)).toEqual([
      'Umsókn um hámarksheildsöluverð - almenn lyf',
      'Umsókn um endurbirtingu upplýsinga í lyfjaverðskrá',
    ])
  })

  it('resolves a real page item to a tag id end to end', () => {
    expect(resolveCategoryTagId(parse()[0])).toBe(
      CATEGORY_TAG_IDS['Verð og greiðsluþátttaka'],
    )
  })

  it('distinguishes downloads from external links', () => {
    const [file, external] = parse()
    expect(file.fileUrl).toContain('.xls')
    expect(file.externalUrl).toBeUndefined()
    expect(external.externalUrl).toBe('https://island.is/endurbirting')
    expect(external.fileUrl).toBeUndefined()
  })
})
