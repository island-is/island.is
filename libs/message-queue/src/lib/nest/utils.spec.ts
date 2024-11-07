import {
  calculateSleepDurationUntilMorning,
  clamp,
  isOutsideWorkingHours,
} from './utils'

const insideWorkingHours = new Date(2021, 1, 1, 9, 0, 0)
const outsideWorkingHours = new Date(2021, 1, 1, 7, 0, 0)
const HOUR_IN_MS = 3600000;


describe('utils', () => {
  describe('clamp', () => {
    it('clamps value between min and max', () => {
      const min = 1,
        max = 10
      expect(clamp(-100, min, max)).toBe(1)
      expect(clamp(1, min, max)).toBe(1)
      expect(clamp(5, min, max)).toBe(5)
      expect(clamp(10, min, max)).toBe(10)
      expect(clamp(100, min, max)).toBe(10)
    })
  })
  describe('isOutsideWorkingHours', () => {
    it('returns true if the current hour is outside working hours', () => {
      jest.useFakeTimers({ now: outsideWorkingHours })
      expect(isOutsideWorkingHours()).toBe(true)
    })
    it('returns false if the current hour is inside working hours', () => {
      jest.useFakeTimers({ now: insideWorkingHours })
      expect(isOutsideWorkingHours()).toBe(false)
    })
  })

  describe('calculateSleepDurationUntilMorning', () => {
    it('calculates the time until the next morning', () => {
      jest.useFakeTimers({ now: new Date(2021, 1, 1, 23, 0, 0) }) // 11 PM
      expect(calculateSleepDurationUntilMorning()).toBe(9 * HOUR_IN_MS) // 9 hours
    })
  })
})
