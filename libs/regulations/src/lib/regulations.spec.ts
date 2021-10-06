import { isPlural } from './utils'

describe('isPlural', () => {
  it('knows Icelandic pluralization rules', () => {
    expect(isPlural(0)).toEqual(true)
    expect(isPlural(1)).toEqual(false)
    expect(isPlural(2)).toEqual(true)
    expect(isPlural(11)).toEqual(true)
    expect(isPlural(20)).toEqual(true)
    expect(isPlural(21)).toEqual(false)
    expect(isPlural(100)).toEqual(true)
    expect(isPlural(101)).toEqual(false)
    expect(isPlural(111)).toEqual(true)
    expect(isPlural(121)).toEqual(false)
  })
})
