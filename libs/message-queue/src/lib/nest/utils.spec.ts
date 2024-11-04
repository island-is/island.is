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
    it('calculates sleep duration correctly for a time at midnight', () => {
      const now = new Date('2023-01-01T00:00:00') // Midnight
      const duration = calculateSleepDurationUntilMorning(now)
      expect(duration).toBe(28800000) // 8 hours in milliseconds
    })

    it('calculates sleep duration correctly for a time in the middle of the night', () => {
      const now = new Date('2023-01-01T05:00:00') // 11 PM
      const duration = calculateSleepDurationUntilMorning(now)
      // 3 hour in milliseconds
      expect(duration).toBe(10800000)
    })

    it('calculates sleep duration correctly for a time just before work starts', () => {
      const now = new Date('2023-01-01T07:59:00') // 7:59 AM
      const duration = calculateSleepDurationUntilMorning(now)
      expect(duration).toBe(60000) // 1 minute in milliseconds
    })
  })
})
