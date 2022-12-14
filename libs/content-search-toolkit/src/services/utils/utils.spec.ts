import { filterDoc } from './index'

describe('filterDoc', () => {
  it('should prune fields that are longer than the letter limit', () => {
    const test: Record<string, unknown> = {
      a: 'some-value',
      b: {
        c: 'some-really-long-value-that-should-get-pruned',
      },
    }

    // Also make the test object circular
    test.d = test

    const result = filterDoc(test, new Set(), 20)
    expect(result).toBe(true)
    expect(test.b).toStrictEqual({})
  })
})
