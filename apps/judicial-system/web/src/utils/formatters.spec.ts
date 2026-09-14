import {
  normalizeBlankString,
  normalizeBlankStrings,
  textToHtml,
} from './formatters'

describe('normalizeBlankString', () => {
  test('should normalize whitespace-only values to an empty string', () => {
    expect(normalizeBlankString('   ')).toBe('')
    expect(normalizeBlankString('\t\t')).toBe('')
    expect(normalizeBlankString('\n \n')).toBe('')
    expect(normalizeBlankString(' ')).toBe('')
  })

  test('should pass an empty string through unchanged', () => {
    expect(normalizeBlankString('')).toBe('')
  })

  test('should preserve leading and trailing whitespace around content', () => {
    expect(normalizeBlankString(' Jón ')).toBe(' Jón ')
  })
})

describe('normalizeBlankStrings', () => {
  test('should normalize whitespace-only string properties', () => {
    expect(
      normalizeBlankStrings({ name: '   ', address: 'Aðalgata 1' }),
    ).toEqual({ name: '', address: 'Aðalgata 1' })
  })

  test('should leave non-string properties untouched', () => {
    const input = {
      name: ' ',
      force: true,
      count: 3,
      citizenship: null,
      numbers: ['012-3456-7890'],
    }

    expect(normalizeBlankStrings(input)).toEqual({
      name: '',
      force: true,
      count: 3,
      citizenship: null,
      numbers: ['012-3456-7890'],
    })
  })

  test('should normalize strings inside plain nested objects', () => {
    expect(
      normalizeBlankStrings({ substances: { ALCOHOL: '   ', OTHER: '1,10' } }),
    ).toEqual({ substances: { ALCOHOL: '', OTHER: '1,10' } })
  })

  test('should leave class instances such as Date untouched', () => {
    const date = new Date('2026-08-21T13:37:00Z')

    const result = normalizeBlankStrings({
      crimeScenes: { '007-2026-1': { place: '   ', date } },
    })

    expect(result.crimeScenes['007-2026-1'].place).toBe('')
    expect(result.crimeScenes['007-2026-1'].date).toBe(date)
  })
})

describe('textToHtml', () => {
  test('should wrap plain text in a paragraph', () => {
    expect(textToHtml('fyrir umferðarlagabrot')).toBe(
      '<p>fyrir umferðarlagabrot</p>',
    )
  })

  test('should convert each line to a paragraph', () => {
    expect(textToHtml('fyrsta línan\nönnur línan')).toBe(
      '<p>fyrsta línan</p><p>önnur línan</p>',
    )
  })

  test('should escape html special characters in plain text', () => {
    expect(textToHtml('hraði < 90 km/klst & meira')).toBe(
      '<p>hraði &lt; 90 km/klst &amp; meira</p>',
    )
  })

  test('should pass rich text through unchanged', () => {
    const html = '<p>fyrir <strong>umferðarlagabrot</strong></p>'

    expect(textToHtml(html)).toBe(html)
  })

  test('should pass an empty string through unchanged', () => {
    expect(textToHtml('')).toBe('')
  })
})
