import {
  calculateSleepDurationUntilMorning,
  clamp,
  isOutsideWorkingHours,
  sleepUntilMorning,
} from './utils'

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
      expect(isOutsideWorkingHours(new Date('2023-01-01T07:00:00'))).toBe(true) // 7 AM
      expect(isOutsideWorkingHours(new Date('2023-01-01T23:00:00'))).toBe(true) // 11 PM
      expect(isOutsideWorkingHours(new Date('2023-01-01T00:00:00'))).toBe(true) // Midnight
      expect(isOutsideWorkingHours(new Date('2023-01-01T08:00:00'))).toBe(false) // 8 AM
      expect(isOutsideWorkingHours(new Date('2023-01-01T22:00:00'))).toBe(false) // 10 PM
    })
  })

  describe('calculateSleepDurationUntilMorning', () => {
    const HOUR_IN_MS = 3600000;
    const MINUTE_IN_MS = 60000;

    it('calculates sleep duration correctly for a time at midnight', () => {
      const now = new Date('2023-01-01T00:00:00') // Midnight
      const duration = calculateSleepDurationUntilMorning(now)
      expect(duration).toBe(8 * HOUR_IN_MS) // 8 hours until 8:00 AM
    })

    it('calculates sleep duration correctly for a time in the middle of the night', () => {
      const now = new Date('2023-01-01T05:00:00') // 5:00 AM
      const duration = calculateSleepDurationUntilMorning(now)
      expect(duration).toBe(3 * HOUR_IN_MS) // 3 hours until 8:00 AM
    })

    it('calculates sleep duration correctly for a time just before work starts', () => {
      const now = new Date('2023-01-01T07:59:00') // 7:59 AM
      const duration = calculateSleepDurationUntilMorning(now)
      expect(duration).toBe(MINUTE_IN_MS) // 1 minute until 8:00 AM
    })

    it('returns appropriate duration when called during working hours', () => {
      const now = new Date('2023-01-01T14:00:00') // 2:00 PM
      const duration = calculateSleepDurationUntilMorning(now)
      expect(duration).toBe(18 * HOUR_IN_MS) // 18 hours until next morning 8:00 AM
    })
  })
})
