import { filterDoc } from './index'

describe('filterDoc', () => {
  it('should handle circular objects being passed', () => {
    const test: Record<string, unknown> = {
      a: 3,
    }
    test.b = test
    const result = filterDoc(test)
    expect(result).toBe(false)
  })
  it('should prune fields that are longer than the letter limit', () => {
    const test: Record<string, unknown> = {
      a: 'some-value',
      b: {
        c: 'some-really-long-value-that-should-get-pruned',
      },
    }
    test.d = test
    const result = filterDoc(test, new Set(), 20)
    expect(result).toBe(true)
    expect(test.b).toStrictEqual({})
  })
})
