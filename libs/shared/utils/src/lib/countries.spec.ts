import { getAllCountryCodes } from './countries'

describe('getAllCountryCodes', () => {
  it('returns the source list unsorted when no locale is passed', () => {
    expect(getAllCountryCodes()).toBe(getAllCountryCodes())
  })

  it('sorts by English name for the en locale', () => {
    const names = getAllCountryCodes('en').map((c) => c.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')))
  })

  it('sorts by Icelandic name for the is locale', () => {
    const names = getAllCountryCodes('is').map((c) => c.name_is ?? c.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'is')))
  })

  it('returns the same countries regardless of locale', () => {
    expect(getAllCountryCodes('is')).toHaveLength(getAllCountryCodes().length)
  })

  it('returns a sorted copy when a locale is passed', () => {
    expect(getAllCountryCodes('en')).not.toBe(getAllCountryCodes())
  })
})
