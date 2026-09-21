import {
  Application,
  NotificationConfig,
  NotificationType,
  ScheduledNotificationArg,
  ScheduledNotificationConfig,
  StaticText,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'

// date-fns formats using the server's local time; this carries a date's UTC
// year/month/day into a local Date so formatting doesn't depend on server TZ.
const toUTCDateOnly = (date: Date) =>
  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

const localizedDateArgs = (
  key: string,
  date: Date,
): ScheduledNotificationArg[] => [
  { key: `${key}Is`, value: format(toUTCDateOnly(date), dateFormat.is) },
  { key: `${key}En`, value: format(toUTCDateOnly(date), dateFormat.en) },
]

/**
 * Returns end-of-day, `days` days after the application was created.
 */
export const endOfDayFromCreation = (
  application: Application,
  days: number,
): Date => {
  const date = new Date(application.created)
  date.setUTCDate(date.getUTCDate() + days)
  const pruneDate = new Date(date)
  pruneDate.setUTCHours(23, 59, 59, 999)
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
  daysBeforePrune: number,
  pruneDate: Date,
  reason: StaticText | ((application: Application) => StaticText),
  featureFlag?: Features,
): ScheduledNotificationConfig => {
  const args: ScheduledNotificationArg[] = [
    ...localizedDateArgs('pruneDate', pruneDate),
    { key: 'daysBeforePrune', value: String(daysBeforePrune) },
    { key: 'reason', message: reason },
  ]
  return {
    template:
      NotificationConfig[NotificationType.ApplicationPruneReminder].templateId,
    includeApplicationLink: true,
    includeApplicationName: true,
    args,
    featureFlag,
    ...timing,
  }
}

/**
 * Returns a ScheduledNotificationConfig that fires `daysBeforePrune` days before
 * `pruneDate`. `reason` is included as a translated `reasonIs`/`reasonEn` arg
 * explaining why the application is pending external action. Pass
 * `featureFlag` to only schedule while the flag is enabled.
 */
export const schedulePruneReminderBefore = (
  pruneDate: Date,
  daysBeforePrune: number,
  reason: StaticText | ((application: Application) => StaticText),
  featureFlag?: Features,
): ScheduledNotificationConfig => {
  const date = new Date(pruneDate)
  date.setUTCDate(date.getUTCDate() - daysBeforePrune)
  return pruneReminder(
    { date },
    daysBeforePrune,
    pruneDate,
    reason,
    featureFlag,
  )
}

/**
 * Returns a ScheduledNotificationConfig that fires `daysBeforePrune` days before
 * `pruneAfterMs` (in milliseconds, e.g. `sevenDays` from a template's own
 * constants). Intended for states with pruneAt defined as a number. `reason`
 * is included as a translated `reasonIs`/`reasonEn` arg explaining why the
 * application is pending external action. Pass `featureFlag` to only
 * schedule while the flag is enabled.
 */
export const schedulePruneReminderAfterDays = (
  pruneAfterMs: number,
  daysBeforePrune: number,
  reason: StaticText | ((application: Application) => StaticText),
  featureFlag?: Features,
): ScheduledNotificationConfig => {
  const pruneDate = new Date(Date.now() + pruneAfterMs)
  return pruneReminder(
    {
      delayInMs: Math.max(0, pruneAfterMs - daysBeforePrune * 24 * 3600 * 1000),
    },
    daysBeforePrune,
    pruneDate,
    reason,
    featureFlag,
  )
}

/**
 * Returns a ScheduledNotificationConfig per entry in `daysBeforeList`, each
 * firing that many days before `periodEndDate`, for the shared
 * ApplicationPeriodEndingReminder HNIPP template. Entries that would fire in
 * the past are dropped — the worker sends past-dated configs immediately on
 * scheduling, which is never the intent here. `periodEndDate` is included as
 * a `periodEndDateIs`/`periodEndDateEn` arg, and the application's own name
 * as a translated `applicationNameIs`/`applicationNameEn` arg. Pass
 * `featureFlag` to only schedule while the flag is enabled.
 */
export const schedulePeriodEndingReminders = (
  periodEndDate: Date,
  daysBeforeList: number[],
  featureFlag?: Features,
): ScheduledNotificationConfig[] =>
  daysBeforeList
    .map((daysBefore) => {
      const date = new Date(periodEndDate)
      date.setUTCDate(date.getUTCDate() - daysBefore)
      return date
    })
    .filter((sendDate) => sendDate.getTime() > Date.now())
    .map((sendDate) => ({
      template:
        NotificationConfig[NotificationType.ApplicationPeriodEndingReminder]
          .templateId,
      date: sendDate,
      includeApplicationLink: true,
      includeApplicationName: true,
      featureFlag,
      args: localizedDateArgs('periodEndDate', periodEndDate),
    }))
