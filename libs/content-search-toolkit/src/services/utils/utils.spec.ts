import { filterDoc, getValidBulkRequestChunk } from './index'

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

describe('getValidBulkRequestChunk', () => {
  it('should return a request chunk of the correct size', () => {
    const test = [
      {
        update: { _id: 'some-id', _index: 'some-index' },
      },
      {
        doc: {
          dateCreated: '2022-06-23T12:57:22.850Z',
          dateUpdated: '1674817889815',
          tags: [],
          title: 'some-title',
          type: 'some-type',
        },
        doc_as_upsert: true,
      },
      { delete: { _id: 'some-other-id', _index: 'some-index' } },
    ]

    const result = getValidBulkRequestChunk(test, 3)

    expect(result.length).toBe(3)
    expect(test.length).toBe(0)
  })
  it('should not exceed the given max size', () => {
    const test = [
      {
        update: { _id: 'some-id', _index: 'some-index' },
      },
      {
        doc: {
          dateCreated: '2022-06-23T12:57:22.850Z',
          dateUpdated: '1674817889815',
          tags: [],
          title: 'some-title',
          type: 'some-type',
        },
        doc_as_upsert: true,
      },
      { delete: { _id: 'some-other-id', _index: 'some-index' } },
    ]

    const startingLength = test.length
    const maxSize = 2

    const result = getValidBulkRequestChunk(test, maxSize)

    expect(result.length).toBeLessThanOrEqual(maxSize)
    expect(test.length).toBe(startingLength - result.length)
  })
})
