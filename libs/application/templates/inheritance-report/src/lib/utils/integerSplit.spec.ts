import { integerPercentageSplit, isEqualWithTolerance } from './integerSplit'

describe('integerPercentageSplit', () => {
  it('should split a total on percentages roughly equally', () => {
    expect(integerPercentageSplit(100, [33.3, 33.3, 33.4])).toEqual([
      33, 33, 34,
    ])
    expect(integerPercentageSplit(10, [11, 19, 31, 39])).toEqual([1, 2, 3, 4])
    expect(integerPercentageSplit(10, [2, 49.5, 48.5])).toEqual([0, 5, 5])
    expect(integerPercentageSplit(100, [2, 49.5, 48.5])).toEqual([2, 50, 48])
    expect(integerPercentageSplit(1000, [2, 49.5, 48.5])).toEqual([
      20, 495, 485,
    ])
  })

  it('should preserve the total when splitting', () => {
    expect(integerPercentageSplit(2, [1, 2, 47, 50])).toEqual([0, 0, 1, 1])
    expect(
      integerPercentageSplit(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 13]),
    ).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])

    // Iterate through some percentages that add up to 100 percent
    // and see if the total is preserved
    const total = 999
    let i = 1
    while (i < 40) {
      let j = 1
      while (j < 25) {
        const s = 100 - i - j // so s + i + j is necessarily 100
        if (s > 0) {
          const res = integerPercentageSplit(total, [i, j, s])
          expect(res.reduceRight((p, c) => p + c)).toEqual(total)
        }
        j += 1
      }
      i += 1
    }
  })

  it('should split deterministically while preserving order', () => {
    expect(integerPercentageSplit(199, [33.3, 33.3, 33.4])).toEqual([
      66, 66, 67,
    ])
    expect(integerPercentageSplit(199, [33.3, 33.4, 33.3])).toEqual([
      66, 67, 66,
    ])
    expect(integerPercentageSplit(199, [33.4, 33.3, 33.3])).toEqual([
      67, 66, 66,
    ])

    expect(integerPercentageSplit(256, [12.5, 42.8, 44.7])).toEqual([
      32, 110, 114,
    ])
    expect(integerPercentageSplit(256, [12.5, 44.7, 42.8])).toEqual([
      32, 114, 110,
    ])
    expect(integerPercentageSplit(256, [44.7, 12.5, 42.8])).toEqual([
      114, 32, 110,
    ])
  })

  it('should correctly divide negative totals', () => {
    expect(integerPercentageSplit(-100, [33.3, 33.3, 33.4])).toEqual([
      -33, -33, -34,
    ])
    expect(integerPercentageSplit(-10, [11, 19, 31, 39])).toEqual([
      -1, -2, -3, -4,
    ])
    expect(integerPercentageSplit(-10, [2, 49.5, 48.5])).toEqual([-0, -5, -5])
    expect(integerPercentageSplit(-100, [2, 49.5, 48.5])).toEqual([
      -2, -50, -48,
    ])
    expect(integerPercentageSplit(-1000, [2, 49.5, 48.5])).toEqual([
      -20, -495, -485,
    ])
  })

  // Exceptions and edge cases
  it('should throw an error when percentages do not add up to 100', () => {
    expect(() => {
      integerPercentageSplit(0, [1, 2, 3])
    }).toThrowError('Percentages must add up to 100 exactly')

    expect(() => {
      integerPercentageSplit(0, [99, 999, 9999])
    }).toThrowError('Percentages must add up to 100 exactly')

    expect(() => {
      integerPercentageSplit(0, [33.333, 33.333, 33.333])
    }).toThrowError('Percentages must add up to 100 exactly')

    // Should be tolerant for 100-d ~= 100 when d is tiny (see tolerance value in function)
    // Usually errors are around 1e-14 in size but we may as well select ~1.0e-10 for some leeway
    // Such miniscule differences should not alter the outcome of results in any meaningful way
    expect(
      integerPercentageSplit(
        0,
        [33.333333333333, 33.333333333333, 33.333333333333],
      ),
    ).toEqual([0, 0, 0])
  })

  it('should throw an error when some percentage is negative', () => {
    expect(() => {
      integerPercentageSplit(0, [100, -10, 10])
    }).toThrowError('A percentage may not be negative')

    expect(() => {
      integerPercentageSplit(
        0,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, -5],
      )
    }).toThrowError('A percentage may not be negative')
  })
})

describe('isEqualWithTolerance', () => {
  it('returns true if abs(target-number) <= tolerance, false otherwise', () => {
    const largeTolerance = 1
    const smallTolerance = 1e-6
    expect(isEqualWithTolerance(100, 100)).toBeTruthy()
    expect(isEqualWithTolerance(100, 99, largeTolerance)).toBeTruthy()
    expect(
      isEqualWithTolerance(-200, -200.000000001, smallTolerance),
    ).toBeTruthy()

    expect(isEqualWithTolerance(888.88, 888.98, smallTolerance)).toBeFalsy()
    expect(
      isEqualWithTolerance(0, 0 - 1.5 * smallTolerance, smallTolerance),
    ).toBeFalsy()
    expect(isEqualWithTolerance(1, -1, largeTolerance)).toBeFalsy()
  })
})
