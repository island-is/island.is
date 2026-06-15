import { sortCaseFiles } from './sortCaseFiles'

describe('sortCaseFiles', () => {
  const file = (
    id: string,
    orderWithinChapter: number | null,
    created: string,
  ) => ({
    id,
    orderWithinChapter,
    created,
  })

  it('should preserve input order for legacy files with no orderWithinChapter', () => {
    const files = [
      file('newest', null, '2024-01-03T00:00:00.000Z'),
      file('middle', null, '2024-01-02T00:00:00.000Z'),
      file('oldest', null, '2024-01-01T00:00:00.000Z'),
    ]

    expect(sortCaseFiles(files).map((f) => f.id)).toEqual([
      'newest',
      'middle',
      'oldest',
    ])
  })

  it('should sort by orderWithinChapter when all files have order', () => {
    const files = [
      file('second', 1, '2024-01-02T00:00:00.000Z'),
      file('first', 0, '2024-01-03T00:00:00.000Z'),
      file('third', 2, '2024-01-01T00:00:00.000Z'),
    ]

    expect(sortCaseFiles(files).map((f) => f.id)).toEqual([
      'first',
      'second',
      'third',
    ])
  })

  it('should preserve input order when only some files have orderWithinChapter', () => {
    const files = [
      file('unordered', null, '2024-01-01T00:00:00.000Z'),
      file('ordered', 0, '2024-01-03T00:00:00.000Z'),
    ]

    expect(sortCaseFiles(files).map((f) => f.id)).toEqual([
      'unordered',
      'ordered',
    ])
  })
})
