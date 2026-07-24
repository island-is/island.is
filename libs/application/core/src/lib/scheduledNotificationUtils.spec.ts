import {
  NotificationConfig,
  NotificationType,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  schedulePruneReminderAfterDays,
  schedulePruneReminderBefore,
} from './scheduledNotificationUtils'

describe('schedulePruneReminderBefore', () => {
  it('should schedule the shared prune reminder daysBefore days before the anchor date', () => {
    const anchorDate = new Date('2026-08-10T23:59:00.000Z')
    const config = schedulePruneReminderBefore(anchorDate, 2)

    expect(config.template).toBe(
      NotificationConfig[NotificationType.ApplicationPruneReminder].templateId,
    )
    expect('date' in config && config.date).toEqual(
      new Date('2026-08-08T23:59:00.000Z'),
    )
  })

  it('should not mutate the anchor date', () => {
    const anchorDate = new Date('2026-08-10T23:59:00.000Z')
    schedulePruneReminderBefore(anchorDate, 7)

    expect(anchorDate).toEqual(new Date('2026-08-10T23:59:00.000Z'))
  })

  it('should opt in to the API-injected applicationLink arg', () => {
    const config = schedulePruneReminderBefore(new Date(), 2)

    expect(config.includeApplicationLink).toBe(true)
  })

  it('should carry the featureFlag through to the config', () => {
    const config = schedulePruneReminderBefore(
      new Date(),
      2,
      Features.applicationSystemHistory,
    )

    expect(config.featureFlag).toBe(Features.applicationSystemHistory)
  })
})

describe('schedulePruneReminderAfterDays', () => {
  const DAY_MS = 24 * 3600 * 1000

  it('should schedule the reminder daysBefore days before the prune delay', () => {
    const config = schedulePruneReminderAfterDays(7 * DAY_MS, 2)

    expect(config.template).toBe(
      NotificationConfig[NotificationType.ApplicationPruneReminder].templateId,
    )
    expect('delayInMs' in config && config.delayInMs).toBe(5 * DAY_MS)
  })

  it('should opt in to the API-injected applicationLink arg', () => {
    const config = schedulePruneReminderAfterDays(7 * DAY_MS, 2)

    expect(config.includeApplicationLink).toBe(true)
  })

  it('should carry the featureFlag through to the config', () => {
    const config = schedulePruneReminderAfterDays(
      7 * DAY_MS,
      2,
      Features.applicationSystemHistory,
    )

    expect(config.featureFlag).toBe(Features.applicationSystemHistory)
  })

  it('should clamp the delay to zero when daysBefore is not less than pruneAfterMs', () => {
    const config = schedulePruneReminderAfterDays(2 * DAY_MS, 7)

    expect('delayInMs' in config && config.delayInMs).toBe(0)
  })
})
