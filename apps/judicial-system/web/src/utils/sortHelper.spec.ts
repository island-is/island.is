import { compareLocaleIS, sortByIcelandicAlphabet } from './sortHelper'

describe('Sort by Icelandic alphabet', () => {
  it('should sort an array of strings in Icelandic alphabetical order', () => {
    const unsortedArray = [
      'Björn',
      'Ásta',
      'Ævar',
      'Þóra',
      'Þórarinn',
      'Ari',
      'Ýr',
    ]
    const expectedSortedArray = [
      'Ari',
      'Ásta',
      'Björn',
      'Ýr',
      'Þóra',
      'Þórarinn',
      'Ævar',
    ]

    const sortedArray = sortByIcelandicAlphabet(unsortedArray)

    expect(sortedArray).toEqual(expectedSortedArray)
  })

  it('should compare two Icelandic strings correctly', () => {
    expect(compareLocaleIS('Ásta', 'Björn')).toBe(-1)
    expect(compareLocaleIS('Björn', 'Ásta')).toBe(1)
    expect(compareLocaleIS('Björn', 'Björn')).toBe(0)
    expect(compareLocaleIS('A', 'Æ')).toBe(-1)
    expect(compareLocaleIS('æ', 'a')).toBe(1)
    expect(compareLocaleIS('A', 'Á')).toBe(-1)
    expect(compareLocaleIS('Þ', 'X')).toBe(1)
    expect(compareLocaleIS('x', 'Þ')).toBe(-1)
    expect(compareLocaleIS('Æ', 'X')).toBe(1)
    expect(compareLocaleIS('X', 'Æ')).toBe(-1)
    expect(compareLocaleIS('Ö', 'é')).toBe(1)
    expect(compareLocaleIS('c', 'Ö')).toBe(-1)
  })

  it('should handle empty and undefined strings', () => {
    expect(compareLocaleIS('', 'Árni')).toBe(-1)
    expect(compareLocaleIS('Árni', '')).toBe(1)
    expect(compareLocaleIS(undefined, 'Björn')).toBe(-1)
    expect(compareLocaleIS('Björn', undefined)).toBe(1)
  })
})
