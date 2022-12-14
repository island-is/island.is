import { filterDoc } from './index'

describe('filterDoc', () => {
  it('should not recurse infinitely if the node is circular', () => {
    const test: Record<string, unknown> = {
      a: 'some-value',
    }
    test.b = test
    const result = filterDoc(test)

    // No field should be pruned
    expect(result).toBe(false)
  })
  it('should prune fields that are longer than the letter limit', () => {
    const test: Record<string, unknown> = {
      a: 'some-value',
      b: {
        c: 'some-really-long-value-that-should-get-pruned',
      },
    }

    const result = filterDoc(test, new Set(), 20)
    expect(result).toBe(true)
    expect(test.b).toStrictEqual({})
  })
})
