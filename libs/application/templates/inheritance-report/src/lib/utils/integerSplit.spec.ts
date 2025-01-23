import { integerSplit } from './integerSplit'
describe('integerSplit', () => {
  it('should split a given amount into roughly equal parts', () => {
    expect(integerSplit(100, 11)).toEqual([10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9])
    expect(integerSplit(10, 3)).toEqual([4, 3, 3])
    expect(integerSplit(100, 6)).toEqual([16, 16, 17, 17, 17, 17])
  })

  it('should return an array that sums up to the total', () => {
    const total = 1000
    let i = 1
    while (i < 1000) {
      const res = integerSplit(total, i)
      const sum = res.reduceRight((p, c) => p + c)
      expect(sum).toEqual(total)
      i += 1
    }
  })

  // Unusual usage and edge cases
  it('creates some zero shares for splits where the total is less than parts', () => {
    expect(integerSplit(4, 5)).toEqual([0, 1, 1, 1, 1])
    expect(integerSplit(6, 12)).toEqual([0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1])
  })

  it('rather than crashing, returns an empty array when requesting 0 or less shares', () => {
    expect(integerSplit(2000, 0)).toEqual([])
    expect(integerSplit(800, -5)).toEqual([])
  })

  it('returns an array of zeroes when splitting 0', () => {
    expect(integerSplit(0, 4)).toEqual([0, 0, 0, 0])
    expect(integerSplit(0, 3)).toEqual([0, 0, 0])
    expect(integerSplit(0, 2)).toEqual([0, 0])
    expect(integerSplit(0, 1)).toEqual([0])
    expect(integerSplit(0, 0)).toEqual([])
  })

  it('also divides negatives roughly equally', () => {
    expect(integerSplit(-100, 11)).toEqual([
      -10, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9,
    ])
    expect(integerSplit(-10, 3)).toEqual([-4, -3, -3])
    expect(integerSplit(-100, 6)).toEqual([-16, -16, -17, -17, -17, -17])
  })
})
