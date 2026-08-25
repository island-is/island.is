import { slugifyFileName, toSafeFileName } from './fileName'

describe('slugifyFileName', () => {
  it('slugifies Icelandic text to plain ASCII', () => {
    expect(slugifyFileName('Ónæmisfræðideild', 'fallback')).toBe(
      'onaemisfraedideild',
    )
  })

  it('falls back when the name is empty', () => {
    expect(slugifyFileName('', 'fylgiskjal')).toBe('fylgiskjal')
  })

  it('does not let a leading Þ get split by decamelization (TH != TH-)', () => {
    expect(slugifyFileName('Þjóðskrá vottorð', 'fallback')).toBe(
      'thjodskra-vottord',
    )
  })

  it('maps ö to a single "o", not the German-style "oe" digraph', () => {
    expect(slugifyFileName('Blóðprufa svör', 'fallback')).toBe('blodprufa-svor')
  })
})

describe('toSafeFileName', () => {
  it('preserves the original extension while slugifying the base name', () => {
    expect(toSafeFileName('Þjóðskrárvottorð.pdf', 'fylgiskjal')).toBe(
      'thjodskrarvottord.pdf',
    )
  })

  it('preserves non-pdf extensions untouched', () => {
    expect(toSafeFileName('mynd.jpg', 'fylgiskjal')).toBe('mynd.jpg')
  })

  it('falls back to the given default when fileName is undefined', () => {
    expect(toSafeFileName(undefined, 'fylgiskjal')).toBe('fylgiskjal')
  })

  it('falls back to the given default when fileName is an empty string', () => {
    expect(toSafeFileName('', 'fylgiskjal')).toBe('fylgiskjal')
  })

  it('does not mistake a dot in the middle of the base name for a missing extension', () => {
    expect(toSafeFileName('v1.2 samantekt.pdf', 'fylgiskjal')).toBe(
      'v1-2-samantekt.pdf',
    )
  })
})
