import { getAllCountryCodes } from './countries'

describe('getAllCountryCodes', () => {
  it('sorts by English name by default', () => {
    const names = getAllCountryCodes().map((c) => c.name)
    expect(names).toEqual(
      [...names].sort((a, b) => a.localeCompare(b, 'en')),
    )
  })

  it('sorts by Icelandic name for the is locale', () => {
    const names = getAllCountryCodes('is').map((c) => c.name_is ?? c.name)
    expect(names).toEqual(
      [...names].sort((a, b) => a.localeCompare(b, 'is')),
    )
  })

  it('returns the same countries regardless of locale', () => {
    expect(getAllCountryCodes('is')).toHaveLength(getAllCountryCodes().length)
  })

  it('returns a fresh array on each call', () => {
    expect(getAllCountryCodes()).not.toBe(getAllCountryCodes())
  })
})
