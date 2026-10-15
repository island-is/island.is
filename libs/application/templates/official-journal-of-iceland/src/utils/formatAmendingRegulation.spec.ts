import getStructuredDiff from '@dmr.is/regulations-tools/structuredDiff-browser'
import { HTMLText } from '@island.is/regulations'
import { RegulationImpactSchema } from '../lib/dataSchema'
import {
  formatAmendingBodyWithArticlePrefix,
  formatAmendingRegTitle,
} from './formatAmendingRegulation'

const title = (text: string) => `<h3 class="article__title">${text}</h3>`

const GILDISTAKA =
  '<p>Reglugerð þessi, sem sett er með heimild í lögum nr. 1/2000, öðlast gildi 1. mars 2010.</p>'

// The amending regulation's gildistaka, written from the base's authority
const CLOSING =
  '<p>Reglugerð þessi er sett með heimild í lögum nr. 1/2000 og öðlast þegar gildi.</p>'

// Paragraph texts are deliberately unlike each other, so the diff reports
// whole paragraphs as inserted or deleted instead of word-level changes.
const BASE = [
  title('1. gr.'),
  '<p>Alfa bravo charlie.</p>',
  '<p>Delta echo foxtrot.</p>',
  '<p>Golf hotel india.</p>',
  title('2. gr. Gildistaka'),
  GILDISTAKA,
].join('')

const amend = (
  after: string,
  overrides: Partial<RegulationImpactSchema> = {},
  before = BASE,
): RegulationImpactSchema => ({
  id: overrides.name ?? '1',
  type: 'amend',
  name: '0123/2020',
  diff: getStructuredDiff(before as HTMLText, after as HTMLText).diff,
  ...overrides,
})

const article = (n: number, html: string) => `${title(`${n}. gr.`)}${html}`

const body = (...impacts: RegulationImpactSchema[]) =>
  formatAmendingBodyWithArticlePrefix(impacts)

describe('formatAmendingBodyWithArticlePrefix', () => {
  it('removes a paragraph and reuses the authority of the base regulation', () => {
    expect(body(amend(BASE.replace('<p>Alfa bravo charlie.</p>', '')))).toEqual(
      [
        article(1, '<p>1. mgr. 1. gr. reglugerðarinnar fellur brott.</p>'),
        article(2, CLOSING),
      ],
    )
  })

  it('changes a paragraph', () => {
    const [first] = body(amend(BASE.replace('Delta echo', 'Delta kilo')))
    expect(first).toBe(
      article(
        1,
        '<p>2. mgr. 1. gr. reglugerðarinnar breytist og orðast svo:</p><p>Delta kilo foxtrot.</p>',
      ),
    )
  })

  it('numbers paragraphs as in the base regulation', () => {
    const after = BASE.replace(
      '<p>Alfa bravo charlie.</p>',
      '<p>Alfa bravo charlie.</p><p>Zulu yankee xray whiskey.</p>',
    ).replace('<p>Golf hotel india.</p>', '')

    expect(body(amend(after))).toEqual([
      article(
        1,
        '<p>Á eftir 1. mgr. 1. gr. reglugerðarinnar kemur ný málsgrein sem orðast svo:</p><p>Zulu yankee xray whiskey.</p>',
      ),
      article(2, '<p>3. mgr. 1. gr. reglugerðarinnar fellur brott.</p>'),
      article(3, CLOSING),
    ])
  })

  it('adds consecutive new paragraphs as one amendment', () => {
    const after = BASE.replace(
      '<p>Delta echo foxtrot.</p>',
      '<p>Delta echo foxtrot.</p><p>Zulu yankee xray whiskey.</p><p>Kilo lima mike november.</p>',
    )
    expect(body(amend(after))).toEqual([
      article(
        1,
        '<p>Á eftir 2. mgr. 1. gr. reglugerðarinnar koma tvær nýjar málsgreinar, svohljóðandi:</p><p>Zulu yankee xray whiskey.</p><p>Kilo lima mike november.</p>',
      ),
      article(2, CLOSING),
    ])
  })

  it('adds consecutive new paragraphs before the first one as one amendment', () => {
    const [first] = body(
      amend(
        BASE.replace(
          title('1. gr.'),
          `${title(
            '1. gr.',
          )}<p>Zulu yankee xray whiskey.</p><p>Kilo lima mike november.</p>`,
        ),
      ),
    )
    expect(first).toBe(
      article(
        1,
        '<p>Á undan 1. mgr. 1. gr. reglugerðarinnar koma tvær nýjar málsgreinar, svohljóðandi:</p><p>Zulu yankee xray whiskey.</p><p>Kilo lima mike november.</p>',
      ),
    )
  })

  it('adds a paragraph before the first one', () => {
    const [first] = body(
      amend(
        BASE.replace(
          title('1. gr.'),
          `${title('1. gr.')}<p>Zulu yankee xray whiskey.</p>`,
        ),
      ),
    )
    expect(first).toContain(
      'Á undan 1. mgr. 1. gr. reglugerðarinnar kemur ný málsgrein svohljóðandi:',
    )
  })

  it('removes a whole article', () => {
    const after = BASE.replace(
      /<h3 class="article__title">1\. gr\.<\/h3>.*?(?=<h3)/,
      '',
    )
    const [first] = body(amend(after))
    expect(first).toBe(
      article(1, '<p>1. gr. reglugerðarinnar fellur brott.</p>'),
    )
  })

  it('adds an article after an existing one', () => {
    const [first] = body(
      amend(`${BASE}${title('3. gr. Nýtt')}<p>Nýr texti.</p>`),
    )
    expect(first).toBe(
      article(
        1,
        '<p>Á eftir 2. gr. reglugerðarinnar kemur ný grein, 3. gr., ásamt fyrirsögn, svohljóðandi:</p> <p>Nýr texti.</p>',
      ),
    )
  })

  it('adds an article before the first one', () => {
    const [first] = body(
      amend(`${title('1. gr. Nýtt')}<p>Nýr texti.</p>${BASE}`),
    )
    expect(first).toContain(
      '<p>Á undan 1. gr. reglugerðarinnar kemur ný grein, 1. gr., ásamt fyrirsögn, svohljóðandi:</p>',
    )
  })

  describe('paragraphs that share words', () => {
    // The case getStructuredDiff is for: getDiff spread a new paragraph that
    // shares words with its neighbours over them.
    const SHARED = [
      title('1. gr.'),
      '<p>Skoðunarstofa skal skoða ökutæki árlega.</p>',
      '<p>Skoðunarstofa skal skrá niðurstöður skoðunar ökutækja.</p>',
      '<p>Ráðherra setur nánari reglur um skoðun ökutækja.</p>',
      title('2. gr. Gildistaka'),
      GILDISTAKA,
    ].join('')
    const NEW =
      '<p>Skoðunarstofa skal senda niðurstöður skoðunar ökutækja til Samgöngustofu.</p>'

    it('adds a paragraph without touching its neighbours', () => {
      const after = SHARED.replace(
        '<p>Ráðherra setur',
        NEW + '<p>Ráðherra setur',
      )
      expect(body(amend(after, {}, SHARED))).toEqual([
        article(
          1,
          '<p>Á eftir 2. mgr. 1. gr. reglugerðarinnar kemur ný málsgrein sem orðast svo:</p>' +
            NEW,
        ),
        article(2, CLOSING),
      ])
    })

    it('removes a paragraph without touching its neighbours', () => {
      const after = SHARED.replace(
        '<p>Skoðunarstofa skal skrá niðurstöður skoðunar ökutækja.</p>',
        '',
      )
      expect(body(amend(after, {}, SHARED))).toEqual([
        article(1, '<p>2. mgr. 1. gr. reglugerðarinnar fellur brott.</p>'),
        article(2, CLOSING),
      ])
    })
  })

  describe('articles renumbered by a new article', () => {
    it('does not amend the heading of an article that was only renumbered', () => {
      const after = BASE.replace(
        title('2. gr. Gildistaka'),
        title('2. gr.') + '<p>Kilo lima mike.</p>' + title('3. gr. Gildistaka'),
      )
      const output = body(amend(after)).join('')
      expect(output).toContain(
        '<p>Á eftir 1. gr. reglugerðarinnar kemur ný grein, 2. gr., svohljóðandi:</p>',
      )
      expect(output).not.toContain('Fyrirsögn')
    })

    it('cites a renumbered article by its number in the base regulation', () => {
      const before = [
        title('1. gr.'),
        '<p>Alfa bravo charlie.</p>',
        title('2. gr.'),
        '<p>Delta echo foxtrot.</p>',
        title('3. gr. Gildistaka'),
        GILDISTAKA,
      ].join('')
      const after = before
        .replace(
          title('2. gr.'),
          title('2. gr.') + '<p>Kilo lima mike.</p>' + title('3. gr.'),
        )
        .replace(title('3. gr. Gildistaka'), title('4. gr. Gildistaka'))
        .replace('Delta echo', 'Delta november')
      const output = body(amend(after, {}, before)).join('')
      expect(output).toContain(
        '<p>1. mgr. 2. gr. reglugerðarinnar breytist og orðast svo:</p><p>Delta november foxtrot.</p>',
      )
      expect(output).not.toContain('Fyrirsögn')
    })
  })

  describe('formatting changed, wording did not', () => {
    it('names a reformatted word', () => {
      const [first] = body(
        amend(BASE.replace('Delta echo', 'Delta <em>echo</em>')),
      )
      expect(first).toBe(
        article(
          1,
          '<p>Snið „echo“ í 2. mgr. 1. gr. reglugerðarinnar hefur breyst.</p>',
        ),
      )
    })

    it('names every reformatted word', () => {
      const before = BASE.replace(
        'Delta echo foxtrot.',
        'Delta echo foxtrot hotel india juliett.',
      )
      const after = before.replace(
        'Delta echo foxtrot hotel india juliett.',
        '<strong>Delta</strong> echo foxtrot hotel <em>india</em> juliett.',
      )
      const [first] = body(amend(after, {}, before))
      expect(first).toBe(
        article(
          1,
          '<p>Snið „Delta“ og „india“ í 2. mgr. 1. gr. reglugerðarinnar hefur breyst.</p>',
        ),
      )
    })

    it('names the paragraph when all of it was reformatted', () => {
      const [first] = body(
        amend(
          BASE.replace(
            '<p>Delta echo foxtrot.</p>',
            '<p><em>Delta echo foxtrot.</em></p>',
          ),
        ),
      )
      expect(first).toBe(
        article(1, '<p>Snið 2. mgr. 1. gr. reglugerðarinnar hefur breyst.</p>'),
      )
    })
  })

  it('names a heading whose subtitle was only made italic', () => {
    const before = BASE.replace(title('1. gr.'), title('1. gr. Gildissvið'))
    const after = BASE.replace(
      title('1. gr.'),
      title('1. gr. <em>Gildissvið</em>'),
    )
    const [first] = body(amend(after, {}, before))
    expect(first).toContain(
      '<p>Snið fyrirsagnar 1. gr. reglugerðarinnar hefur breyst.</p>',
    )
  })

  it('closes the list when list items are added', () => {
    const [first] = body(
      amend(
        BASE.replace(
          '<p>Delta echo foxtrot.</p>',
          '<p>Delta echo foxtrot.</p><ol><li>kilo</li><li>lima</li></ol>',
        ),
      ),
    )
    expect(first).toBe(
      article(
        1,
        '<p>Töluliðum eftir 2. mgr. 1. gr. reglugerðarinnar er bætt við:</p><ol><li>kilo</li><li>lima</li></ol>',
      ),
    )
  })

  describe('tables', () => {
    const row = (...cells: string[]) =>
      `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`
    const table = (...rows: string[]) =>
      `<table><tbody>${rows.join('')}</tbody></table>`
    const HEADER = row('Tegund', 'Afli')
    const TABLE = table(HEADER, row('Loðna', '100'), row('Þorskur', '200'))
    const WITH_TABLE = [
      title('1. gr.'),
      '<p>Heildarafli er sem hér segir:</p>',
      TABLE,
      title('2. gr. Gildistaka'),
      GILDISTAKA,
    ].join('')
    const first = (after: string, before = WITH_TABLE) =>
      body(amend(after, {}, before))[0]

    it('shows the header and the changed rows', () => {
      expect(first(WITH_TABLE.replace('100', '150'))).toBe(
        article(
          1,
          '<p>Í töflu í 1. gr. reglugerðarinnar er gerð breyting, svohljóðandi:</p>' +
            table(HEADER, row('Loðna', '150')),
        ),
      )
    })

    it('shows an added row', () => {
      const after = WITH_TABLE.replace(
        row('Þorskur', '200'),
        row('Þorskur', '200') + row('Ýsa', '300'),
      )
      expect(first(after)).toBe(
        article(
          1,
          '<p>Í töflu í 1. gr. reglugerðarinnar er gerð breyting, svohljóðandi:</p>' +
            table(HEADER, row('Ýsa', '300')),
        ),
      )
    })

    it('gives the whole table when a row is removed', () => {
      expect(first(WITH_TABLE.replace(row('Loðna', '100'), ''))).toBe(
        article(
          1,
          '<p>Tafla í 1. gr. reglugerðarinnar verður svohljóðandi:</p>' +
            table(HEADER, row('Þorskur', '200')),
        ),
      )
    })

    it('adds a new table', () => {
      const before = WITH_TABLE.replace(TABLE, '')
      expect(first(WITH_TABLE, before)).toBe(
        article(
          1,
          '<p>Á eftir 1. mgr. 1. gr. reglugerðarinnar kemur ný tafla, svohljóðandi:</p>' +
            TABLE,
        ),
      )
    })

    it('removes a table', () => {
      expect(first(WITH_TABLE.replace(TABLE, ''))).toBe(
        article(1, '<p>Tafla í 1. gr. reglugerðarinnar fellur brott.</p>'),
      )
    })

    it('numbers the tables as in the base regulation', () => {
      const other = table(row('Ríki', 'Afli'), row('Noregur', '50'))
      const after = WITH_TABLE.replace(
        TABLE,
        other + TABLE.replace('100', '150'),
      )
      expect(body(amend(after, {}, WITH_TABLE)).join('')).toContain(
        '<p>Í töflu í 1. gr. reglugerðarinnar er gerð breyting, svohljóðandi:</p>',
      )
    })

    it('numbers the tables when an article has more than one', () => {
      const other = table(row('Ríki', 'Afli'), row('Noregur', '50'))
      const before = WITH_TABLE.replace(TABLE, TABLE + other)
      expect(first(before.replace('50', '60'), before)).toBe(
        article(
          1,
          '<p>Í 2. töflu í 1. gr. reglugerðarinnar er gerð breyting, svohljóðandi:</p>' +
            table(row('Ríki', 'Afli'), row('Noregur', '60')),
        ),
      )
    })
  })

  it('keeps appendix changes after the article changes', () => {
    const output = body(
      amend(BASE.replace('Golf hotel', 'Golf kilo'), {
        appendixes: [
          {
            title: 'Viðauki I',
            diff: getStructuredDiff(
              '<p>Alfa.</p>' as HTMLText,
              '<p>Bravo.</p>' as HTMLText,
            ).diff,
          },
        ],
      }),
    )
    expect(output.map((a) => a.match(/<p>(.*?):/)?.[1])).toEqual([
      '3. mgr. 1. gr. reglugerðarinnar breytist og orðast svo',
      'Eftirfarandi breytingar eru gerðar á Viðauka I',
      undefined, // gildistaka
    ])
  })

  it('keeps a chapter heading change in document order', () => {
    const chapter = (text: string) => `<h2 class="chapter__title">${text}</h2>`
    const before = [
      title('1. gr.'),
      '<p>Alfa bravo charlie.</p>',
      chapter('II. KAFLI Úthlutun'),
      title('2. gr.'),
      '<p>Delta echo foxtrot.</p>',
    ].join('')
    const after = before
      .replace('Alfa bravo', 'Alfa kilo')
      .replace('Úthlutun', 'Heildarafli')
      .replace('Delta echo', 'Delta kilo')
    const output = body(amend(after, {}, before))
    expect(output.slice(0, 3).map((a) => a.match(/<p>(.*?):/)?.[1])).toEqual([
      '1. mgr. 1. gr. reglugerðarinnar breytist og orðast svo',
      'Fyrirsögn II. KAFLI reglugerðarinnar breytist og orðast svo',
      '1. mgr. 2. gr. reglugerðarinnar breytist og orðast svo',
    ])
  })

  it('escapes text taken from the regulation', () => {
    const [first] = body(
      amend(
        BASE.replace(
          'Delta echo foxtrot.',
          'Gjald skal vera &lt; 5 &amp; &gt; 2.',
        ),
      ),
    )
    expect(first).toContain('<p>Gjald skal vera &lt; 5 &amp; &gt; 2.</p>')
  })

  it('treats a changed gildistaka paragraph as an amendment', () => {
    const output = body(amend(BASE.replace('1. mars 2010', '1. janúar 2027')))
    expect(output).toEqual([
      article(
        1,
        '<p>1. mgr. 2. gr. reglugerðarinnar breytist og orðast svo:</p><p>Reglugerð þessi, sem sett er með heimild í lögum nr. 1/2000, öðlast gildi 1. janúar 2027.</p>',
      ),
      article(2, CLOSING),
    ])
  })

  it('uses the date of the change, not the base regulation', () => {
    const output = body(
      amend(BASE.replace('Alfa bravo', 'Alfa kilo'), { date: '2026-12-01' }),
    )
    expect(output[output.length - 1]).toBe(
      article(
        2,
        '<p>Reglugerð þessi er sett með heimild í lögum nr. 1/2000 og öðlast gildi 1. desember 2026.</p>',
      ),
    )
  })

  it('dates each change when only some of them have a date', () => {
    const output = body(
      amend(BASE.replace('Alfa bravo', 'Alfa kilo'), {
        name: '0001/2020',
        date: '2026-12-01',
      }),
      {
        id: '2',
        type: 'repeal',
        name: '0005/2020',
        regTitle: 'Reglugerð um prufu.',
      },
    )
    expect(output[output.length - 1]).toBe(
      article(
        3,
        '<p>Reglugerð þessi er sett með heimild í lögum nr. 1/2000.</p>' +
          '<p>Ákvæði 1. gr. reglugerðarinnar öðlast gildi 1. desember 2026.</p>' +
          '<p>Ákvæði 2. gr. reglugerðarinnar öðlast þegar gildi.</p>',
      ),
    )
  })

  it('joins the authorities of every amended regulation', () => {
    const other = BASE.replace('lögum nr. 1/2000', '5. gr. laga nr. 2/2001')
    const output = body(
      amend(BASE.replace('Alfa bravo', 'Alfa kilo'), { name: '0001/2020' }),
      amend(
        other.replace('Alfa bravo', 'Alfa kilo'),
        { name: '0002/2020' },
        other,
      ),
    )
    expect(output[output.length - 1]).toBe(
      article(
        3,
        '<p>Reglugerð þessi er sett með heimild í lögum nr. 1/2000 og með heimild í 5. gr. laga nr. 2/2001 og öðlast þegar gildi.</p>',
      ),
    )
  })

  it('leaves out what the base regulation incorporates into Icelandic law', () => {
    const before = [
      title('1. gr.'),
      '<p>Alfa bravo charlie.</p>',
      title('2. gr.'),
      '<p>Með reglugerð þessari öðlast gildi hér á landi eftirtaldar reglugerðir, með þeim breytingum og viðbótum sem leiðir af XIII. viðauka EES-samningsins:</p>',
      '<p>Reglugerð þessi er sett með heimild í 145. gr. laga um loftferðir nr. 60/1998 og öðlast þegar gildi.</p>',
    ].join('')
    expect(
      body(amend(before.replace('Alfa bravo', 'Alfa kilo'), {}, before)),
    ).toEqual([
      article(
        1,
        '<p>1. mgr. 1. gr. reglugerðarinnar breytist og orðast svo:</p><p>Alfa kilo charlie.</p>',
      ),
      article(
        2,
        '<p>Reglugerð þessi er sett með heimild í 145. gr. laga um loftferðir nr. 60/1998 og öðlast þegar gildi.</p>',
      ),
    ])
  })

  it('falls back to a placeholder authority', () => {
    const before = BASE.replace(title('2. gr. Gildistaka') + GILDISTAKA, '')
    const output = body(
      amend(
        before.replace('Alfa bravo', 'Alfa kilo'),
        { date: '2026-12-01' },
        before,
      ),
    )
    expect(output[output.length - 1]).toBe(
      article(
        2,
        '<p>Reglugerð þessi er sett með heimild í [] og öðlast gildi 1. desember 2026.</p>',
      ),
    )
  })

  it('keeps each regulation together and dates each group of articles', () => {
    const b = [
      title('1. gr.'),
      '<p>Alfa.</p>',
      title('2. gr.'),
      '<p>Bravo.</p>',
      title('3. gr.'),
      '<p>Charlie.</p>',
    ].join('')
    const output = body(
      amend(
        b
          .replace('Charlie.', 'Charlie breytt.')
          .replace('Alfa.', 'Alfa breytt.'),
        { name: '0001/2020', date: '2026-11-01' },
        b,
      ),
      amend(
        b.replace('Bravo.', 'Bravo breytt.'),
        { name: '0002/2020', date: '2026-12-01' },
        b,
      ),
    )

    expect(output.slice(0, 3).map((a) => a.match(/<p>(.*?):/)?.[1])).toEqual([
      '1. mgr. 1. gr. reglugerðar nr. 1/2020 breytist og orðast svo',
      '1. mgr. 3. gr. reglugerðar nr. 1/2020 breytist og orðast svo',
      '1. mgr. 2. gr. reglugerðar nr. 2/2020 breytist og orðast svo',
    ])
    expect(output[3]).toBe(
      article(
        4,
        '<p>Reglugerð þessi er sett með heimild í [].</p>' +
          '<p>Ákvæði 1. gr. og 2. gr. reglugerðarinnar öðlast gildi 1. nóvember 2026.</p>' +
          '<p>Ákvæði 3. gr. reglugerðarinnar öðlast gildi 1. desember 2026.</p>',
      ),
    )
  })

  it('repeals a regulation', () => {
    expect(
      body({
        id: '1',
        type: 'repeal',
        name: '0005/2020',
        regTitle: 'Reglugerð um prufu.',
      }),
    ).toEqual([
      article(1, '<p>Reglugerð nr. 5/2020 um prufu fellur brott.</p>'),
      article(
        2,
        '<p>Reglugerð þessi er sett með heimild í [] og öðlast þegar gildi.</p>',
      ),
    ])
  })

  it('gives a renumbered and renamed heading its new title alone', () => {
    const before = [
      title('1. gr.'),
      '<p>Alfa bravo charlie.</p>',
      title('2. gr. Gildissvið'),
      '<p>Delta echo foxtrot.</p>',
      title('3. gr. Gildistaka'),
      GILDISTAKA,
    ].join('')
    const after = before
      .replace(
        title('2. gr. Gildissvið'),
        title('2. gr. Nýmæli') +
          '<p>Kilo lima mike.</p>' +
          title('3. gr. Umfang reglna'),
      )
      .replace(title('3. gr. Gildistaka'), title('4. gr. Gildistaka'))
    const output = body(amend(after, {}, before)).join('')
    expect(output).toContain(
      '<p>Fyrirsögn 2. gr. reglugerðarinnar breytist og orðast svo:</p><p>Umfang reglna',
    )
    expect(output).not.toContain('3<br />')
  })

  it('restates a paragraph when only whitespace was reformatted', () => {
    const before = BASE.replace(
      'Alfa bravo charlie.',
      'Alfa bravo charlie delta echo.',
    )
    const after = before.replace(
      'Alfa bravo charlie delta echo.',
      'Alfa<em> </em>bravo charlie delta echo.',
    )
    expect(body(amend(after, {}, before))[0]).toBe(
      article(
        1,
        '<p>1. mgr. 1. gr. reglugerðarinnar breytist og orðast svo:</p><p>Alfa bravo charlie delta echo.</p>',
      ),
    )
  })

  it('does not amend a removed signature', () => {
    const SIGNATURE =
      '<p class="Dags">Innviðaráðuneytinu, 1. mars 2010.</p><p class="FHUndirskr">Jón Jónsson</p>'
    expect(body(amend(BASE, {}, BASE + SIGNATURE))).toEqual([])
  })

  it('returns nothing when there is nothing to amend', () => {
    expect(body(amend(BASE))).toEqual([])
    expect(body()).toEqual([])
  })
})

describe('formatAmendingBodyWithArticlePrefix: list type changes', () => {
  const list = (type: string, ...items: string[]) =>
    `<ol${type ? ` type="${type}"` : ''}>${items
      .map((item) => `<li>${item}</li>`)
      .join('')}</ol>`
  const withList = (type: string, ...items: string[]) =>
    [
      title('1. gr.'),
      '<p>Reglugerð þessi gildir um:</p>',
      list(type, ...items),
      title('2. gr. Gildistaka'),
      GILDISTAKA,
    ].join('')
  const first = (before: string, after: string) =>
    formatAmendingBodyWithArticlePrefix([
      {
        id: '1',
        type: 'amend',
        name: '0123/2020',
        diff: getStructuredDiff(before as HTMLText, after as HTMLText).diff,
      },
    ])[0]

  it('makes töluliðir stafliðir', () => {
    expect(
      first(
        withList('', 'fólksbifreiðar,', 'vörubifreiðar.'),
        withList('a', 'fólksbifreiðar,', 'vörubifreiðar.'),
      ),
    ).toBe(
      article(
        1,
        '<p>Töluliðir í 1. mgr. 1. gr. reglugerðarinnar verða stafliðir.</p>',
      ),
    )
  })

  it('makes stafliðir töluliðir', () => {
    expect(
      first(
        withList('a', 'fólksbifreiðar,', 'vörubifreiðar.'),
        withList('', 'fólksbifreiðar,', 'vörubifreiðar.'),
      ),
    ).toBe(
      article(
        1,
        '<p>Stafliðir í 1. mgr. 1. gr. reglugerðarinnar verða töluliðir.</p>',
      ),
    )
  })

  it('makes töluliðir stafliðir and restates them when an item changed too', () => {
    expect(
      first(
        withList('', 'fólksbifreiðar,', 'vörubifreiðar.'),
        withList('a', 'fólksbifreiðar,', 'vöruflutningabifreiðar.'),
      ),
    ).toBe(
      article(
        1,
        '<p>Töluliðir í 1. mgr. 1. gr. reglugerðarinnar verða stafliðir og orðast svo:</p>' +
          list('a', 'fólksbifreiðar,', 'vöruflutningabifreiðar.'),
      ),
    )
  })

  it('makes stafliðir töluliðir and restates them when an item changed too', () => {
    expect(
      first(
        withList('a', 'fólksbifreiðar,', 'vörubifreiðar.'),
        withList('', 'fólksbifreiðar,', 'vöruflutningabifreiðar.'),
      ),
    ).toBe(
      article(
        1,
        '<p>Stafliðir í 1. mgr. 1. gr. reglugerðarinnar verða töluliðir og orðast svo:</p>' +
          list('', 'fólksbifreiðar,', 'vöruflutningabifreiðar.'),
      ),
    )
  })

  it('restates töluliðir when every item changed', () => {
    expect(
      first(
        withList('', 'alfa,', 'bravo.'),
        withList('', 'charlie,', 'delta,', 'echo.'),
      ),
    ).toBe(
      article(
        1,
        '<p>Töluliðir í 1. mgr. 1. gr. reglugerðarinnar orðast svo:</p>' +
          list('', 'charlie,', 'delta,', 'echo.'),
      ),
    )
  })

  it('restates stafliðir when every item changed', () => {
    expect(
      first(
        withList('a', 'alfa,', 'bravo.'),
        withList('a', 'charlie,', 'delta,', 'echo.'),
      ),
    ).toBe(
      article(
        1,
        '<p>Stafliðir í 1. mgr. 1. gr. reglugerðarinnar orðast svo:</p>' +
          list('a', 'charlie,', 'delta,', 'echo.'),
      ),
    )
  })

  it('names a tölul. whose formatting alone changed', () => {
    expect(
      first(
        withList('', 'fólksbifreiðar,', 'vörubifreiðar,', 'bifhjól.'),
        withList('', 'fólksbifreiðar,', '<em>vörubifreiðar</em>,', 'bifhjól.'),
      ),
    ).toBe(
      article(
        1,
        '<p>Eftirfarandi breytingar verða á 1. mgr. 1. gr. reglugerðarinnar:</p> <p>Snið 2. tölul. hefur breyst.</p>',
      ),
    )
  })

  it('names a stafliður whose formatting alone changed', () => {
    expect(
      first(
        withList('a', 'fólksbifreiðar,', 'vörubifreiðar,', 'bifhjól.'),
        withList('a', 'fólksbifreiðar,', '<em>vörubifreiðar</em>,', 'bifhjól.'),
      ),
    ).toBe(
      article(
        1,
        '<p>Eftirfarandi breytingar verða á 1. mgr. 1. gr. reglugerðarinnar:</p> <p>Snið b-liðar hefur breyst.</p>',
      ),
    )
  })

  describe('stafliðir nested in töluliðir', () => {
    const nested = (second: string) =>
      `alfa:${list('a', 'eitt atriði hér,', second)}`
    const BEFORE = withList('', nested('annað atriði hér.'), 'bravo.')
    const LEAD =
      '<p>Eftirfarandi breytingar verða á 1. mgr. 1. gr. reglugerðarinnar:</p> '

    it('keeps the tölul. prefix for a nested change when the tölul. was reformatted too', () => {
      expect(
        first(
          BEFORE,
          withList(
            '',
            `<em>alfa:</em>${list(
              'a',
              'eitt atriði hér,',
              'annað atriði þar.',
            )}`,
            'bravo.',
          ),
        ),
      ).toBe(
        article(
          1,
          LEAD +
            '<p>Snið 1. tölul. hefur breyst.</p><p>Töluliður 1, b-liður orðast svo: annað atriði þar.</p>',
        ),
      )
    })

    it('does not name the outer list when only the nested list changed type', () => {
      // One of the two lists changed type, and the markup does not say
      // which, so nothing is generated: the author words it.
      expect(
        first(
          withList('', `alfa:${list('a', 'eitt,', 'tvö.')}`, 'bravo.'),
          withList('', `alfa:${list('', 'eitt,', 'tvö.')}`, 'bravo.'),
        ),
      ).toBeUndefined()
    })

    it('rewords a nested stafliður', () => {
      expect(
        first(BEFORE, withList('', nested('annað atriði þar.'), 'bravo.')),
      ).toBe(
        article(
          1,
          LEAD + '<p>Töluliður 1, b-liður orðast svo: annað atriði þar.</p>',
        ),
      )
    })

    it('names a nested stafliður whose formatting alone changed', () => {
      expect(
        first(
          BEFORE,
          withList('', nested('<em>annað atriði hér.</em>'), 'bravo.'),
        ),
      ).toBe(
        article(1, LEAD + '<p>Töluliður 1, snið b-liðar hefur breyst.</p>'),
      )
    })

    it('numbers a tölul. after a nested list by its place in its own list', () => {
      expect(
        first(BEFORE, withList('', nested('annað atriði hér.'), 'charlie.')),
      ).toBe(article(1, LEAD + '<p>2. tölul. orðast svo: charlie.</p>'))
      expect(
        first(
          BEFORE,
          withList('', nested('annað atriði hér.'), '<em>bravo.</em>'),
        ),
      ).toBe(article(1, LEAD + '<p>Snið 2. tölul. hefur breyst.</p>'))
    })
  })

  it('keeps new paragraphs on either side of a list that changed type', () => {
    const before = [
      title('1. gr.'),
      '<p>Alfa bravo charlie.</p>',
      list('', 'fólksbifreiðar,', 'vörubifreiðar.'),
      '<p>Golf hotel india.</p>',
      title('2. gr. Gildistaka'),
      GILDISTAKA,
    ].join('')
    const after = before
      .replace(
        '<p>Alfa bravo charlie.</p>',
        '<p>Alfa bravo charlie.</p><p>Kilo lima mike.</p>',
      )
      .replace('<ol>', '<ol type="a">')
      .replace(
        '<p>Golf hotel india.</p>',
        '<p>November oscar papa.</p><p>Golf hotel india.</p>',
      )
    const output = formatAmendingBodyWithArticlePrefix([
      {
        id: '1',
        type: 'amend',
        name: '0123/2020',
        diff: getStructuredDiff(before as HTMLText, after as HTMLText).diff,
      },
    ])
    expect(
      output.slice(0, 3).map((a) => a.match(/<p>(.*?)<\/p>/)?.[1]),
    ).toEqual([
      'Á eftir 1. mgr. 1. gr. reglugerðarinnar kemur ný málsgrein sem orðast svo:',
      'Töluliðir í 1. mgr. 1. gr. reglugerðarinnar verða stafliðir.',
      'Á eftir 1. mgr. 1. gr. reglugerðarinnar kemur ný málsgrein sem orðast svo:',
    ])
  })

  it('does not call italic items a change of list type', () => {
    expect(
      first(
        withList('a', 'fólksbifreiðar,', 'vörubifreiðar.'),
        withList('a', '<em>fólksbifreiðar,</em>', '<em>vörubifreiðar.</em>'),
      ),
    ).not.toContain('verða töluliðir')
  })
})

describe('formatAmendingRegTitle', () => {
  const impact = (
    type: 'amend' | 'repeal',
    name: string,
    regTitle?: string,
  ): RegulationImpactSchema => ({ id: name, type, name, regTitle })

  it('returns the prefix alone without impacts', () => {
    expect(formatAmendingRegTitle([])).toBe('Reglugerð um ')
    expect(formatAmendingRegTitle([], { skipRegulationPrefix: true })).toBe(
      'um ',
    )
  })

  it('names an amended regulation', () => {
    expect(
      formatAmendingRegTitle([
        impact('amend', '0123/2020', 'Reglugerð um prufu'),
      ]),
    ).toBe('Reglugerð um breytingu á reglugerð um prufu, nr. 123/2020.')
    expect(formatAmendingRegTitle([impact('amend', '0123/2020')])).toBe(
      'Reglugerð um breytingu á reglugerð nr. 123/2020.',
    )
  })

  it('puts the number last and ends with one period', () => {
    expect(
      formatAmendingRegTitle([
        impact('amend', '0468/2014', 'Reglugerð um Framkvæmdasjóð aldraðra.'),
      ]),
    ).toBe(
      'Reglugerð um breytingu á reglugerð um Framkvæmdasjóð aldraðra, nr. 468/2014.',
    )
    expect(
      formatAmendingRegTitle([
        impact('repeal', '0468/2014', 'Reglugerð um Framkvæmdasjóð aldraðra.'),
      ]),
    ).toBe(
      'Reglugerð um brottfellingu reglugerðar nr. 468/2014 um Framkvæmdasjóð aldraðra.',
    )
  })

  it('keeps the period of an abbreviation', () => {
    expect(
      formatAmendingRegTitle([
        impact(
          'amend',
          '0029/1993',
          'Reglugerð um vörugjald af ökutækjum, eldsneyti o.fl.',
        ),
      ]),
    ).toBe(
      'Reglugerð um breytingu á reglugerð um vörugjald af ökutækjum, eldsneyti o.fl., nr. 29/1993.',
    )
    expect(
      formatAmendingRegTitle([
        impact(
          'repeal',
          '0029/1993',
          'Reglugerð um vörugjald af ökutækjum, eldsneyti o.fl.',
        ),
      ]),
    ).toBe(
      'Reglugerð um brottfellingu reglugerðar nr. 29/1993 um vörugjald af ökutækjum, eldsneyti o.fl.',
    )
  })

  it('names each amended regulation once', () => {
    expect(
      formatAmendingRegTitle(
        [
          impact('amend', '0001/2020', 'Reglugerð um A'),
          impact('amend', '0001/2020', 'Reglugerð um A'),
        ],
        { skipRegulationPrefix: true },
      ),
    ).toBe('um breytingu á reglugerð um A, nr. 1/2020.')
  })

  it('numbers every repealed regulation and leaves out self', () => {
    expect(
      formatAmendingRegTitle(
        [
          impact('amend', 'self'),
          impact('repeal', '0001/2020', 'Reglugerð um A'),
          impact('repeal', '0002/2020', 'Reglugerð um B'),
        ],
        { skipRegulationPrefix: true },
      ),
    ).toBe(
      'um brottfellingu reglugerðar nr. 1/2020 um A og reglugerðar nr. 2/2020 um B.',
    )
  })

  it('repeats "reglugerð" for each amended regulation', () => {
    expect(
      formatAmendingRegTitle([
        impact('amend', '0694/2010', 'Reglugerð um almannaflug flugvéla'),
        impact('amend', '0695/2010', 'Reglugerð um almannaflug þyrlna'),
      ]),
    ).toBe(
      'Reglugerð um breytingu á reglugerð um almannaflug flugvéla, nr. 694/2010 og reglugerð um almannaflug þyrlna, nr. 695/2010.',
    )
    expect(
      formatAmendingRegTitle(
        [
          impact('amend', '0001/2020', 'Reglugerð um A'),
          impact('amend', '0002/2020', 'Reglugerð um B'),
          impact('amend', '0003/2020', 'Reglugerð um C'),
        ],
        { skipRegulationPrefix: true },
      ),
    ).toBe(
      'um breytingu á reglugerð um A, nr. 1/2020, reglugerð um B, nr. 2/2020 og reglugerð um C, nr. 3/2020.',
    )
  })

  it('combines amendments and repeals', () => {
    expect(
      formatAmendingRegTitle([
        impact('amend', '0001/2020', 'Reglugerð um A'),
        impact('repeal', '0002/2020', 'Reglugerð um B'),
      ]),
    ).toBe(
      'Reglugerð um breytingu á reglugerð um A, nr. 1/2020 og brottfellingu reglugerðar nr. 2/2020 um B.',
    )
  })
})
