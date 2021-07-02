import { toStringScope } from './toStringScope'

describe('toStringScope', () => {
  it('should return a string for an array of scope', () => {
    expect(toStringScope(['scope1', 'scope2'])).toBe('scope1 scope2')
  })

  it('should return an empty string when no scope is defined', () => {
    expect(toStringScope()).toBe('')
    expect(toStringScope([])).toBe('')
  })
})
