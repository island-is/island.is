import { HTMLText } from '@island.is/regulations'
import { findAffectedRegulationsInText } from './guessers'

const find = (text: string) =>
  findAffectedRegulationsInText('', text as HTMLText)

describe('findAffectedRegulationsInText', () => {
  it('accepts empty titles and/or text', () => {
    expect(find(``)).toEqual([])
  })
  it('detects things that look something like regulation names', () => {
    expect(
      find(
        `<p>Something 112/2012 blah</p><p>Something 0113/2012, eða  114 / 2012, sem og 1 /2012</p>`,
      ),
    ).toEqual(['0112/2012', '0113/2012', '0114/2012', '0001/2012'])
  })
  it('returns each number only once', () => {
    expect(
      find(`<p>Something 112/2012 blah something 0113/2012, eða 0112/2012</p>`),
    ).toEqual(['0112/2012', '0113/2012'])
  })
  it('returns numbers in the order they appear', () => {
    expect(
      findAffectedRegulationsInText(
        'Regugerð um breytingu á reglugerð nr. 0444/1997',
        `<p>Something 999/2020 blah</p><p>Something 111/2000</p>` as HTMLText,
      ),
    ).toEqual(['0444/1997', '0999/2020', '0111/2000'])
  })
  it('allows "árið"', () => {
    expect(
      find(
        `<p>Something 112, árið 2012 blah</p><p>Something 0113 frá árinu 2012, eða  114 , frá Árinu 2012</p>`,
      ),
    ).toEqual(['0112/2012', '0113/2012', '0114/2012'])
  })
  it('allows parenthesis around numbers', () => {
    expect(
      find(
        `
        <p>Something (112/2012 blah)</p><p>Something (0113/2012), eða  ( 114 / 2012), sem og (1 /2012 )</p>
        <p>Something (112, árið 2021 blah)</p><p>Something ( 0113 frá árinu 2021), eða  (114 , frá Árinu 2021 )</p>
        `,
      ),
    ).toEqual([
      '0112/2012',
      '0113/2012',
      '0114/2012',
      '0001/2012',
      '0112/2021',
      '0113/2021',
      '0114/2021',
    ])
  })
  it('ignores too long numbers (and years)', () => {
    expect(
      find(`<p>Something 00110/2012 blah og 112/20120 eða 12345/2012</p>`),
    ).toEqual([])
  })
  it('ignores impossible years', () => {
    expect(
      find(
        `<p>Something 112/1899 blah og 112/2112, and 112/0112, or  112/201</p>`,
      ),
    ).toEqual([])
  })
  it('tries to ignore Law numbers', () => {
    expect(
      find(
        `<p>Something something lög nr. 112/2012 blah og lögum númer 113/2012, og laga nr. 114/2012 eða laga nr. 115/2012 sem og lög 116/2012</p>`,
      ),
    ).toEqual([])
  })
})
