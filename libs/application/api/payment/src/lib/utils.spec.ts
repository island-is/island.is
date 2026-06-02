import { isWorkday, addWorkDays } from './utils'
import { getHolidays } from 'fridagar'

describe('payment utils', () => {
  describe('isWorkday', () => {
    it('should return false for weekends', () => {
      const holidays = getHolidays(2026)
      // May 2, 2026 is a Saturday
      expect(isWorkday(new Date(2026, 4, 2), holidays)).toBe(false)
      // May 3, 2026 is a Sunday
      expect(isWorkday(new Date(2026, 4, 3), holidays)).toBe(false)
    })

    it('should return false for May 1st, 2026 (Labor Day)', () => {
      const holidays = getHolidays(2026)
      expect(isWorkday(new Date(2026, 4, 1), holidays)).toBe(false) // 4 = May
    })

    it('should return false for May 14th, 2026 (Ascension Day)', () => {
      const holidays = getHolidays(2026)
      expect(isWorkday(new Date(2026, 4, 14), holidays)).toBe(false)
    })

    it('should return false for August 3rd, 2026 (Commerce Day)', () => {
      const holidays = getHolidays(2026)
      expect(isWorkday(new Date(2026, 7, 3), holidays)).toBe(false) // 7 = August
    })

    it('should return true for a regular workday (e.g. May 4th, 2026)', () => {
      const holidays = getHolidays(2026)
      expect(isWorkday(new Date(2026, 4, 4), holidays)).toBe(true) // Monday
    })

    it('should return false for Maundy Thursday (Skírdagur, Apr 2nd, 2026)', () => {
      const holidays = getHolidays(2026)
      expect(isWorkday(new Date(2026, 3, 2), holidays)).toBe(false) // 3 = April
    })
    it('should return false for Good Friday (Föstudagurinn langi, Apr 3rd, 2026)', () => {
      const holidays = getHolidays(2026)
      expect(isWorkday(new Date(2026, 3, 3), holidays)).toBe(false)
    })
    it('should return false for Easter Monday (Annar í páskum, Apr 6th, 2026)', () => {
      const holidays = getHolidays(2026)
      expect(isWorkday(new Date(2026, 3, 6), holidays)).toBe(false)
    })
    it('should return false for a holiday that falls on a weekend (Hvítasunnudagur, Sun May 24th, 2026)', () => {
      // May 24, 2026 is BOTH Pentecost AND a Sunday.
      // Confirms the function returns false consistently when the two reasons overlap.
      const holidays = getHolidays(2026)
      expect(isWorkday(new Date(2026, 4, 24), holidays)).toBe(false)
    })
  })

  describe('addWorkDays', () => {
    it('should add days and skip weekends and holidays', () => {
      // April 30th, 2026 is Thursday.
      // 1 workday later should be Monday, May 4th
      // (Skips Friday May 1st, and weekend May 2nd, May 3rd)
      const startDate = new Date(2026, 3, 30) // 3 = April
      const result = addWorkDays(startDate, 1)

      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(4) // May
      expect(result.getDate()).toBe(4) // 4th
    })

    it('should skip May 14th, 2026 (Ascension Day)', () => {
      // May 13th, 2026 is Wednesday.
      // 1 workday later should be Friday, May 15th
      // (Skips Thursday May 14th)
      const startDate = new Date(2026, 4, 13)
      const result = addWorkDays(startDate, 1)

      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(4)
      expect(result.getDate()).toBe(15)
    })

    it('should skip August 3rd, 2026 (Commerce Day)', () => {
      // July 31st, 2026 is Friday.
      // 1 workday later should be Tuesday, August 4th
      // (Skips weekend Aug 1-2, and Commerce Day Aug 3)
      const startDate = new Date(2026, 6, 31) // 6 = July
      const result = addWorkDays(startDate, 1)

      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(7) // August
      expect(result.getDate()).toBe(4)
    })

    it('should correctly skip multiple holidays (May 1st and May 14th) over a longer span', () => {
      // Start on Thursday, April 30, 2026
      const startDate = new Date(2026, 3, 30) // 3 = April

      // We want to add 10 workdays.
      // 10 workdays normally take exactly 2 weeks (14 calendar days).
      // However, because we hit:
      // - May 1st (Friday) - Labor Day (skip)
      // - May 14th (Thursday) - Ascension Day (skip)
      // It should push the final date out by 2 extra calendar days over the weekend.

      const result = addWorkDays(startDate, 10)

      // Expected date trace:
      // 1. May 4 (Mon)
      // 2. May 5 (Tue)
      // 3. May 6 (Wed)
      // 4. May 7 (Thu)
      // 5. May 8 (Fri)
      // 6. May 11 (Mon)
      // 7. May 12 (Tue)
      // 8. May 13 (Wed)
      // - May 14 is a holiday (Thu)
      // 9. May 15 (Fri)
      // 10. May 18 (Mon) <- Final target date

      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(4) // May
      expect(result.getDate()).toBe(18) // 18th
    })

    it('should correctly cross over into a new year and fetch new holidays (2025 -> 2026)', () => {
      // Start on Monday, December 29, 2025
      const startDate = new Date(2025, 11, 29) // 11 = December

      // We want to add 2 workdays.
      // 1. Dec 30, 2025 (Tuesday) - Workday 1
      // - Dec 31, 2025 (Wednesday) - New Year's Eve (Holiday)
      // - Jan 1, 2026 (Thursday) - New Year's Day (Holiday)
      // 2. Jan 2, 2026 (Friday) - Workday 2 <- Final target date

      const result = addWorkDays(startDate, 2)

      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(0) // 0 = January
      expect(result.getDate()).toBe(2)
    })

    it('should return an equivalent date when days = 0', () => {
      // No-op: while loop never runs, function returns a clone of the input.
      const startDate = new Date(2026, 4, 4) // Mon May 4
      const result = addWorkDays(startDate, 0)

      expect(result.getTime()).toBe(startDate.getTime())
      // Confirms the function returns a *new* Date instance (defensive copy).
      expect(result).not.toBe(startDate)
    })

    it('should return an equivalent date when days is negative (documents current behavior)', () => {
      // The implementation guards on `while (days > 0)`, so negative input is a silent no-op.
      // This test pins that behavior; revisit if the contract changes (e.g. throw on invalid input).
      const startDate = new Date(2026, 4, 4) // Mon May 4
      const result = addWorkDays(startDate, -3)

      expect(result.getTime()).toBe(startDate.getTime())
    })

    it('should return the next workday when starting on a weekend (Sat May 2nd, 2026)', () => {
      // Saturday May 2, 2026 + 1 workday should be Monday May 4
      // (Skips Sunday May 3; May 1 (Fri) is irrelevant since we only move forward).
      const startDate = new Date(2026, 4, 2)
      const result = addWorkDays(startDate, 1)

      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(4) // May
      expect(result.getDate()).toBe(4) // Mon
    })

    it('should preserve the time-of-day when adding workdays', () => {
      // Wed Apr 29, 2026 at 14:30:45.123 -> Thu Apr 30 at 14:30:45.123
      const startDate = new Date(2026, 3, 29, 14, 30, 45, 123)
      const result = addWorkDays(startDate, 1)

      expect(result.getDate()).toBe(30)
      expect(result.getHours()).toBe(14)
      expect(result.getMinutes()).toBe(30)
      expect(result.getSeconds()).toBe(45)
      expect(result.getMilliseconds()).toBe(123)
    })
  })
  describe('createDailyCompletionNotifications', () => {
    it('creates one notification per day inclusive', () => {
      const start = new Date('2026-01-01')
      const end = new Date('2026-01-03')
      const result = createDailyCompletionNotifications(
        'https://link',
        start,
        end,
      )
      expect(result).toHaveLength(3)
    })
    it('includes applicationLink in args', () => {
      const result = createDailyCompletionNotifications(
        'https://link',
        new Date('2026-01-01'),
        new Date('2026-01-01'),
      )
      expect(result[0].args).toEqual([
        { key: 'applicationLink', value: 'https://link' },
      ])
    })
    it('uses ApplicationCompletionReminder template', () => {
      const result = createDailyCompletionNotifications(
        'https://link',
        new Date('2026-01-01'),
        new Date('2026-01-01'),
      )
      expect(result[0].template).toBe(
        NotificationConfig[NotificationType.ApplicationCompletionReminder]
          .templateId,
      )
    })
  })
})
