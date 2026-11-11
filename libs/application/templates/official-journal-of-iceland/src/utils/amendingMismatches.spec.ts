import getStructuredDiff from '@dmr.is/regulations-tools/structuredDiff-browser'
import { HTMLText } from '@island.is/regulations'
import { RegulationImpactSchema } from '../lib/dataSchema'
import { Addition, getAmendingMismatches } from './amendingMismatches'
import { formatAmendingBodyWithArticlePrefix } from './formatAmendingRegulation'

const base64 = (html: string) => Buffer.from(html).toString('base64')

const diff = (before: string, after: string) =>
  getStructuredDiff(before as HTMLText, after as HTMLText).diff

const FEES =
  '<h3>5. gr.</h3><p>Gjaldið er kr. 1.500 á ári.</p><h3>6. gr.</h3><p>Umsókn skal fylgja vottorð.</p>'

const amend = (
  after: string,
  overrides: Partial<RegulationImpactSchema> = {},
): RegulationImpactSchema => ({
  id: '1',
  type: 'amend',
  name: '0123/2020',
  diff: diff(FEES, after),
  ...overrides,
})

const raised = amend(FEES.replace('1.500', '1.800'))

const text = (amount: string) =>
  `<h3 class="article__title">1. gr.</h3><p>Í stað „kr. 1.500“ í 5. gr. reglugerðarinnar kemur: kr. ${amount}.</p>`

const check = (
  html: string,
  impacts: RegulationImpactSchema[],
  additions?: Addition[],
) => getAmendingMismatches({ html: base64(html), additions, impacts })

describe('getAmendingMismatches', () => {
  it('finds nothing when the text makes the recorded change', () => {
    expect(check(text('1.800'), [raised])).toEqual({ values: [], wording: [] })
  })

  it('reports an amount changed in the text alone, both ways', () => {
    expect(check(text('1.900'), [raised]).values).toEqual([
      {
        type: 'missingFromText',
        text: '1.800',
        place: { regulation: '123/2020', section: '5. gr.' },
      },
      { type: 'notInChanges', text: '1.900', section: '1. gr.' },
    ])
  })

  it('finds nothing in the text OJOI generates from the changes', () => {
    const generated = formatAmendingBodyWithArticlePrefix([raised]).join('')
    expect(check(generated, [raised])).toEqual({ values: [], wording: [] })
  })

  it('groups wording by regulation and section', () => {
    const certificate = amend(
      FEES.replace('vottorð.', 'vottorð um búsetu og skráningu lögheimilis.'),
    )
    const { values, wording } = check(
      '<h3 class="article__title">1. gr.</h3><p>Við 6. gr. reglugerðarinnar bætist nýr málsliður.</p>',
      [certificate],
    )
    expect(values).toEqual([])
    expect(wording).toEqual([
      {
        place: { regulation: '123/2020', section: '6. gr.' },
        texts: ['vottorð um búsetu og skráningu lögheimilis'],
      },
    ])
  })

  it('names the appendix a change is recorded on', () => {
    const was = '<h2>Viðauki I</h2><p>Gjaldskrá: 1.234 kr.</p>'
    const impact = amend(FEES, {
      appendixes: [
        { title: 'Viðauki I', diff: diff(was, was.replace('1.234', '1.300')) },
      ],
    })
    expect(
      check(
        '<h3 class="article__title">1. gr.</h3><p>Viðauki I við reglugerðina breytist.</p>',
        [impact],
      ).values,
    ).toEqual([
      {
        type: 'missingFromText',
        text: '1.300',
        place: { regulation: '123/2020', appendix: 'Viðauki I' },
      },
    ])
  })

  it('reads the HTML appendixes published with the text, not files', () => {
    const was = '<h2>Viðauki I</h2><p>Gjaldskrá: 1.234 kr.</p>'
    const impact = amend(FEES, {
      appendixes: [
        { title: 'Viðauki I', diff: diff(was, was.replace('1.234', '1.300')) },
      ],
    })
    const lead =
      '<h3 class="article__title">1. gr.</h3><p>Viðauki I við reglugerðina orðast svo:</p>'
    const appendix = base64('<p>Gjaldskrá: 1.300 kr.</p>')
    expect(
      check(lead, [impact], [{ title: 'Viðauki I', content: appendix }]).values,
    ).toEqual([])
    expect(
      check(
        lead,
        [impact],
        [{ title: 'Viðauki I', content: appendix, type: 'file' }],
      ).values.map((v) => v.text),
    ).toEqual(['1.300'])
  })

  it('compares a replaced appendix with its text after a reload, without a diff', () => {
    const tariff = '<p>Skoðun: kr. 2.000.</p><p>Endurskoðun: kr. 3.500.</p>'
    const html = `${text(
      '1.800',
    )}<h3 class="article__title">2. gr.</h3><p>Viðauki I við reglugerðina orðast svo:</p>${tariff}`
    const impact = {
      ...raised,
      appendixes: [{ title: 'Viðauki I', text: tariff }],
    }
    expect(check(html, [impact])).toEqual({ values: [], wording: [] })
    expect(check(html.replace('3.500', '3.600'), [impact]).values).toEqual([
      { type: 'notInChanges', text: '3.600', section: '2. gr.' },
    ])
    const revoked = {
      ...raised,
      appendixes: [{ title: 'Viðauki I', text: tariff, revoked: true }],
    }
    expect(check(html, [revoked]).values.map((v) => v.text)).toEqual([
      '2.000',
      '3.500',
    ])
  })

  it('reports nothing as missing from changes when a change has no diff', () => {
    const unknown = { ...raised, id: '2', diff: undefined }
    expect(check(text('1.900'), [raised, unknown]).values).toEqual([
      {
        type: 'missingFromText',
        text: '1.800',
        place: { regulation: '123/2020', section: '5. gr.' },
      },
    ])
  })

  it('names only an article of the text, not an appendix title', () => {
    const lead =
      '<h3 class="article__title">1. gr.</h3><p>5. gr. reglugerðarinnar breytist.</p>'
    const appendix = base64('<p>Gjald: kr. 9.999.</p>')
    expect(
      check(
        lead,
        [raised],
        [{ title: 'Viðauki við 3. gr. reglugerðarinnar', content: appendix }],
      ).values.filter((v) => v.type === 'notInChanges'),
    ).toEqual([{ type: 'notInChanges', text: '9.999', section: undefined }])
  })

  it('needs a change with a diff and some text', () => {
    expect(check(text('1.900'), [{ ...raised, diff: undefined }])).toEqual({
      values: [],
      wording: [],
    })
    expect(
      check(text('1.900'), [
        { id: '2', type: 'repeal', name: '0123/2020' },
      ] as RegulationImpactSchema[]),
    ).toEqual({ values: [], wording: [] })
    expect(check('', [raised])).toEqual({ values: [], wording: [] })
  })
})
