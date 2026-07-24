import {
  Application,
  NotificationConfig,
  NotificationType,
  ScheduledNotificationConfig,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'

/**
 * Returns end-of-day, `days` days after the application was created.
 */
export const endOfDayFromCreation = (
  application: Application,
  days: number,
): Date => {
  const date = new Date(application.created)
  date.setDate(date.getDate() + days)
  const pruneDate = new Date(date)
  pruneDate.setUTCHours(23, 59, 59)
  return pruneDate
}

// Past-dated configs are sent immediately by the worker — callers must guard against this if unwanted.

/**
 * Shared base for the prune reminder variants below: the single
 * ApplicationPruneReminder HNIPP template, which links back to the
 * application via the `applicationLink` arg the API injects when scheduling.
 */
const pruneReminder = (
  timing: { date: Date } | { delayInMs: number },
  featureFlag?: Features,
): ScheduledNotificationConfig => ({
  template:
    NotificationConfig[NotificationType.ApplicationPruneReminder].templateId,
  includeApplicationLink: true,
  featureFlag,
  ...timing,
})

/**
 * Returns a ScheduledNotificationConfig that fires `daysBefore` days before
 * `anchorDate` (e.g. the prune date or a registration deadline). Pass
 * `featureFlag` to only schedule while the flag is enabled.
 */
export const schedulePruneReminderBefore = (
  anchorDate: Date,
  daysBefore: number,
  featureFlag?: Features,
): ScheduledNotificationConfig => {
  const date = new Date(anchorDate)
  date.setDate(date.getDate() - daysBefore)
  return pruneReminder({ date }, featureFlag)
}

/**
 * Returns a ScheduledNotificationConfig that fires `daysBefore` days before
 * `pruneAfterMs` (in milliseconds, e.g. `sevenDays` from a template's own
 * constants). Intended for states with pruneAt defined as a number. Pass
 * `featureFlag` to only schedule while the flag is enabled.
 */
export const schedulePruneReminderAfterDays = (
  pruneAfterMs: number,
  daysBefore: number,
  featureFlag?: Features,
): ScheduledNotificationConfig => {
  return pruneReminder(
    {
      delayInMs: Math.max(0, pruneAfterMs - daysBefore * 24 * 3600 * 1000),
    },
    featureFlag,
  )
}
