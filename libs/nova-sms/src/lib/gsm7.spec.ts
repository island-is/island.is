import { toGsm7 } from './gsm7'

describe('toGsm7', () => {
  it('leaves plain ASCII text unchanged', () => {
    const text =
      'Hello world: 123 (test) #1 @island.is\n\nhttps://island.is/a?b=c&d=e'
    expect(toGsm7(text)).toBe(text)
  })

  it('substitutes Icelandic letters', () => {
    expect(toGsm7('áðíóúýþ ÁÐÍÓÚÝ')).toBe('adiouyth ADIOUY')
  })

  it('keeps Icelandic letters that are part of GSM-7', () => {
    expect(toGsm7('éæö ÉÆÖ')).toBe('éæö ÉÆÖ')
  })

  it('transliterates names', () => {
    expect(toGsm7('Guðrún Þórðardóttir')).toBe('Gudrun Thordardottir')
    expect(toGsm7('Þórður Björnsson')).toBe('Thordur Björnsson')
  })

  it('uses TH for Þ when the following letter is uppercase', () => {
    expect(toGsm7('ÞÓRÐUR')).toBe('THORDUR')
    expect(toGsm7('Þór')).toBe('Thor')
    expect(toGsm7('Þ')).toBe('Th')
  })

  it('replaces typographic punctuation', () => {
    expect(toGsm7('„Halló“ – ‘já’ … • x')).toBe('"Hallo" - \'ja\' ... - x')
  })

  it('replaces non-breaking and typographic spaces', () => {
    expect(toGsm7('a b c\td')).toBe('a b c d')
  })

  it('reduces other accented Latin letters to their base letter', () => {
    expect(toGsm7('Müller Ćirić Łukasz Şahin Nguyễn François')).toBe(
      'Müller Ciric Lukasz Sahin Nguyen Francois',
    )
  })

  it('drops emoji and unsupported symbols', () => {
    expect(toGsm7('Hæ 👋 heimur ✓ ok 🇮🇸')).toBe('Hæ  heimur  ok ')
  })

  it('keeps GSM-7 extension characters', () => {
    expect(toGsm7('{a} [b] ^ ~ | \\ €10')).toBe('{a} [b] ^ ~ | \\ €10')
  })

  it('keeps supported accented characters from other languages', () => {
    expect(toGsm7('Ñandú señor über Ålesund Ørsted ça')).toBe(
      'Ñandu señor über Ålesund Ørsted ca',
    )
  })

  it('preserves newlines and carriage returns', () => {
    expect(toGsm7('a\nb\r\nc')).toBe('a\nb\r\nc')
  })

  it('percent-encodes non-ASCII characters in URLs instead of transliterating them', () => {
    expect(toGsm7('Skoða: https://island.is/leit?q=þjónusta&a=b%20c')).toBe(
      'Skoda: https://island.is/leit?q=%C3%BEj%C3%B3nusta&a=b%20c',
    )
  })

  it('leaves ASCII URLs untouched and transliterates text around them', () => {
    expect(
      toGsm7('Sjá http://island.is/a/b?c=d og https://x.is/þ\nÞakka þér'),
    ).toBe('Sja http://island.is/a/b?c=d og https://x.is/%C3%BE\nThakka thér')
  })

  it('drops emoji attached to a URL without throwing', () => {
    expect(toGsm7('Sjá https://island.is/x📄 núna')).toBe(
      'Sja https://island.is/x nuna',
    )
  })

  it('transliterates typographic punctuation trailing a URL instead of encoding it into the link', () => {
    expect(toGsm7('Sjá „https://island.is/x“ – https://island.is/y…')).toBe(
      'Sja "https://island.is/x" - https://island.is/y...',
    )
  })

  it('returns an empty string for empty input', () => {
    expect(toGsm7('')).toBe('')
  })
})
