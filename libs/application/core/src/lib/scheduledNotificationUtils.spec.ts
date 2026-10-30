import {
  NotificationConfig,
  NotificationType,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  endOfDayFromCreation,
  schedulePeriodEndingReminders,
  schedulePruneReminderAfterDays,
  schedulePruneReminderBefore,
} from './scheduledNotificationUtils'

const testReason = { id: 'test.reason', defaultMessage: 'Some reason' }

describe('endOfDayFromCreation', () => {
  it('should return 23:59:59.999 UTC on the day `days` days after creation', () => {
    const application = { created: new Date('2026-08-10T14:23:45.123Z') }

    expect(endOfDayFromCreation(application as any, 2)).toEqual(
      new Date('2026-08-12T23:59:59.999Z'),
    )
  })

  it('should use UTC calendar arithmetic regardless of the process timezone', () => {
    const originalTz = process.env.TZ
    process.env.TZ = 'America/New_York'

    try {
      const application = { created: new Date('2026-08-10T14:23:45.123Z') }

      expect(endOfDayFromCreation(application as any, 2)).toEqual(
        new Date('2026-08-12T23:59:59.999Z'),
      )
    } finally {
      process.env.TZ = originalTz
    }
  })
})

describe('schedulePruneReminderBefore', () => {
  it('should schedule the shared prune reminder daysBefore days before the anchor date', () => {
    const anchorDate = new Date('2026-08-10T23:59:00.000Z')
    const config = schedulePruneReminderBefore(anchorDate, 2, testReason)

    expect(config.template).toBe(
      NotificationConfig[NotificationType.ApplicationPruneReminder].templateId,
    )
    expect('date' in config && config.date).toEqual(
      new Date('2026-08-08T23:59:00.000Z'),
    )
  })

  it('should not mutate the anchor date', () => {
    const anchorDate = new Date('2026-08-10T23:59:00.000Z')
    schedulePruneReminderBefore(anchorDate, 7, testReason)

    expect(anchorDate).toEqual(new Date('2026-08-10T23:59:00.000Z'))
  })

  it('should opt in to the API-injected applicationLink arg', () => {
    const config = schedulePruneReminderBefore(new Date(), 2, testReason)

    expect(config.includeApplicationLink).toBe(true)
  })

  it('should carry pruneDateIs/En, daysBeforePrune and reason through as args', () => {
    const pruneDate = new Date('2026-08-10T23:59:00.000Z')
    const config = schedulePruneReminderBefore(pruneDate, 2, testReason)

    expect(config.args).toEqual([
      { key: 'pruneDateIs', value: '10.08.2026' },
      { key: 'pruneDateEn', value: '10/08/2026' },
      { key: 'daysBeforePrune', value: '2' },
      { key: 'reason', message: testReason },
    ])
  })

  it('should carry the featureFlag through to the config', () => {
    const config = schedulePruneReminderBefore(
      new Date(),
      2,
      testReason,
      Features.applicationSystemHistory,
    )

    expect(config.featureFlag).toBe(Features.applicationSystemHistory)
  })

  it('should opt in to the API-resolved applicationName args', () => {
    const config = schedulePruneReminderBefore(new Date(), 2, testReason)

    expect(config.includeApplicationName).toBe(true)
  })

  it('should carry a function-form reason through as a message-type arg', () => {
    const reason = (application: any) => testReason
    const config = schedulePruneReminderBefore(new Date(), 2, reason)

    expect(config.args).toContainEqual({ key: 'reason', message: reason })
  })
})

describe('schedulePruneReminderAfterDays', () => {
  const DAY_MS = 24 * 3600 * 1000

  it('should schedule the reminder daysBefore days before the prune delay', () => {
    const config = schedulePruneReminderAfterDays(7 * DAY_MS, 2, testReason)

    expect(config.template).toBe(
      NotificationConfig[NotificationType.ApplicationPruneReminder].templateId,
    )
    expect('delayInMs' in config && config.delayInMs).toBe(5 * DAY_MS)
  })

  it('should opt in to the API-injected applicationLink arg', () => {
    const config = schedulePruneReminderAfterDays(7 * DAY_MS, 2, testReason)

    expect(config.includeApplicationLink).toBe(true)
  })

  it('should carry pruneDateIs/En, daysBeforePrune and reason through as args', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-08-08T00:00:00.000Z'))

    try {
      const config = schedulePruneReminderAfterDays(7 * DAY_MS, 2, testReason)

      expect(config.args).toEqual([
        { key: 'pruneDateIs', value: '15.08.2026' },
        { key: 'pruneDateEn', value: '15/08/2026' },
        { key: 'daysBeforePrune', value: '2' },
        { key: 'reason', message: testReason },
      ])
    } finally {
      jest.useRealTimers()
    }
  })

  it('should carry the featureFlag through to the config', () => {
    const config = schedulePruneReminderAfterDays(
      7 * DAY_MS,
      2,
      testReason,
      Features.applicationSystemHistory,
    )

    expect(config.featureFlag).toBe(Features.applicationSystemHistory)
  })

  it('should clamp the delay to zero when daysBefore is not less than pruneAfterMs', () => {
    const config = schedulePruneReminderAfterDays(2 * DAY_MS, 7, testReason)

    expect('delayInMs' in config && config.delayInMs).toBe(0)
  })

  it('should opt in to the API-resolved applicationName args', () => {
    const config = schedulePruneReminderAfterDays(7 * DAY_MS, 2, testReason)

    expect(config.includeApplicationName).toBe(true)
  })

  it('should carry a function-form reason through as a message-type arg', () => {
    const reason = (application: any) => testReason
    const config = schedulePruneReminderAfterDays(7 * DAY_MS, 2, reason)

    expect(config.args).toContainEqual({ key: 'reason', message: reason })
  })
})

describe('schedulePeriodEndingReminders', () => {
  const periodEndDate = new Date('2026-08-20T23:59:59.999Z')

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should schedule one config per daysBeforeList entry, offset from periodEndDate', () => {
    jest.setSystemTime(new Date('2026-08-01T00:00:00.000Z'))

    const configs = schedulePeriodEndingReminders(periodEndDate, [7, 2])

    expect(configs.map((c) => 'date' in c && c.date)).toEqual([
      new Date('2026-08-13T23:59:59.999Z'),
      new Date('2026-08-18T23:59:59.999Z'),
    ])
  })

  it('should not mutate periodEndDate', () => {
    jest.setSystemTime(new Date('2026-08-01T00:00:00.000Z'))
    const original = new Date(periodEndDate)

    schedulePeriodEndingReminders(periodEndDate, [7, 2])

    expect(periodEndDate).toEqual(original)
  })

  it('should use UTC calendar arithmetic regardless of the process timezone', () => {
    jest.setSystemTime(new Date('2026-08-01T00:00:00.000Z'))
    const originalTz = process.env.TZ
    process.env.TZ = 'America/New_York'

    try {
      const configs = schedulePeriodEndingReminders(periodEndDate, [7])

      expect('date' in configs[0] && configs[0].date).toEqual(
        new Date('2026-08-13T23:59:59.999Z'),
      )
    } finally {
      process.env.TZ = originalTz
    }
  })

  it('should filter out entries that would fire in the past', () => {
    // Between the 7-days-before (Aug 13) and 2-days-before (Aug 18) send dates
    jest.setSystemTime(new Date('2026-08-15T00:00:00.000Z'))

    const configs = schedulePeriodEndingReminders(periodEndDate, [7, 2])

    expect(configs.map((c) => 'date' in c && c.date)).toEqual([
      new Date('2026-08-18T23:59:59.999Z'),
    ])
  })

  it('should return an empty array when every entry would fire in the past', () => {
    jest.setSystemTime(new Date('2026-08-21T00:00:00.000Z'))

    const configs = schedulePeriodEndingReminders(periodEndDate, [7, 2])

    expect(configs).toEqual([])
  })

  it('should use the ApplicationPeriodEndingReminder template id', () => {
    jest.setSystemTime(new Date('2026-08-01T00:00:00.000Z'))

    const configs = schedulePeriodEndingReminders(periodEndDate, [7])

    expect(configs[0].template).toBe(
      NotificationConfig[NotificationType.ApplicationPeriodEndingReminder]
        .templateId,
    )
  })

  it('should opt in to the API-injected applicationLink arg', () => {
    jest.setSystemTime(new Date('2026-08-01T00:00:00.000Z'))

    const configs = schedulePeriodEndingReminders(periodEndDate, [7])

    expect(configs[0].includeApplicationLink).toBe(true)
  })

  it('should carry the featureFlag through to each config', () => {
    jest.setSystemTime(new Date('2026-08-01T00:00:00.000Z'))

    const configs = schedulePeriodEndingReminders(
      periodEndDate,
      [7, 2],
      Features.applicationSystemHistory,
    )

    expect(
      configs.every((c) => c.featureFlag === Features.applicationSystemHistory),
    ).toBe(true)
  })

  it('should carry periodEndDateIs/En as formatted args, unaffected by daysBefore', () => {
    jest.setSystemTime(new Date('2026-08-01T00:00:00.000Z'))

    const configs = schedulePeriodEndingReminders(periodEndDate, [7, 2])

    for (const config of configs) {
      expect(config.args).toEqual([
        { key: 'periodEndDateIs', value: '20.08.2026' },
        { key: 'periodEndDateEn', value: '20/08/2026' },
      ])
    }
  })

  it('should opt in to the API-resolved applicationName args', () => {
    jest.setSystemTime(new Date('2026-08-01T00:00:00.000Z'))

    const configs = schedulePeriodEndingReminders(periodEndDate, [7])

    expect(configs[0].includeApplicationName).toBe(true)
  })
})
