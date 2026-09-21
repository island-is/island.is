import { getNormalizedSearchTerms,getSortedAndFilteredList } from './search'

describe('getNormalizedSearchTerms', () => {
  it('lowercases and splits on spaces', () => {
    expect(getNormalizedSearchTerms('Jón Jónsson')).toEqual(['jón', 'jónsson'])
  })

  it('trims surrounding whitespace', () => {
    expect(getNormalizedSearchTerms('  hreyfill  ')).toEqual(['hreyfill'])
  })

  it('strips intermediate diacritic mark', () => {
    // Simulates the intermediate state when typing á, é, í on some OSes
    expect(getNormalizedSearchTerms('jo´n')).toEqual(['jon'])
  })

  it('returns single-element array for single word', () => {
    expect(getNormalizedSearchTerms('hreyfill')).toEqual(['hreyfill'])
  })
})

describe('getSortedAndFilteredList', () => {
  type Item = { name: string; station: string }
  const list: Item[] = [
    { name: 'Brynjólfur', station: 'Hreyfill' },
    { name: 'Ásgeir', station: 'BSR' },
    { name: 'Brynja', station: 'Borgarbílastöð' },
    { name: 'Sigríður', station: 'Hreyfill' },
  ]

  it('returns all items when search terms are empty', () => {
    const result = getSortedAndFilteredList(list, [''], ['name'])
    expect(result).toHaveLength(4)
  })

  it('filters by a single search term', () => {
    const result = getSortedAndFilteredList(list, ['sigríður'], ['name'])
    expect(result).toEqual([{ name: 'Sigríður', station: 'Hreyfill' }])
  })

  it('puts items starting with the full search string before partial matches', () => {
    // 'bryn' starts Brynjólfur and is contained in Brynja — Brynjólfur starts with it
    const result = getSortedAndFilteredList(list, ['bryn'], ['name'])
    expect(result[0].name).toBe('Brynjólfur')
    expect(result[1].name).toBe('Brynja')
  })

  it('searches across multiple keys', () => {
    const result = getSortedAndFilteredList(list, ['hreyfill'], ['name', 'station'])
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.name)).toEqual(
      expect.arrayContaining(['Brynjólfur', 'Sigríður']),
    )
  })

  it('requires all terms to match (AND logic)', () => {
    const result = getSortedAndFilteredList(
      list,
      ['brynja', 'borgarbílastöð'],
      ['name', 'station'],
    )
    expect(result).toEqual([{ name: 'Brynja', station: 'Borgarbílastöð' }])
  })

  it('returns empty array when no items match', () => {
    const result = getSortedAndFilteredList(list, ['enginn'], ['name'])
    expect(result).toHaveLength(0)
  })

  it('coerces non-string values to string for searching', () => {
    type WithCount = { name: string; driverCount: number }
    const items: WithCount[] = [
      { name: 'Hreyfill', driverCount: 42 },
      { name: 'BSR', driverCount: 5 },
    ]
    const result = getSortedAndFilteredList(items, ['42'], ['name', 'driverCount'])
    expect(result).toEqual([{ name: 'Hreyfill', driverCount: 42 }])
  })

  it('handles null/undefined field values without throwing', () => {
    type WithNullable = { name: string; callNumber: string | null | undefined }
    const items: WithNullable[] = [
      { name: 'Jón', callNumber: null },
      { name: 'Gunnar', callNumber: undefined },
    ]
    expect(() =>
      getSortedAndFilteredList(items, ['jón'], ['name', 'callNumber']),
    ).not.toThrow()
  })
})
