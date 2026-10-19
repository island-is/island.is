import addDays from 'date-fns/addDays'
import addMilliseconds from 'date-fns/addMilliseconds'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
  PruningApplication,
  PruningNotification,
  ScheduledNotificationConfig,
} from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { getApplicationCardRentalSummary } from './applicationCardSummary'
import { getHousingBenefitsPruneDate } from './pruneUtils'

/** Days after entering a state (draft, assignee approval, applicant submit) until a reminder is sent. */
export const REMINDER_DAYS_AFTER_STATE_ENTRY = 5

/** Days before pruning that the applicant gets a last reminder while in draft. */
export const DRAFT_REMINDER_DAYS_BEFORE_PRUNE = 5

const DAY_MS = 24 * 60 * 60 * 1000

/** Local testing only — reminders are sent 1 minute after entering the state. */
const LOCAL_SCHEDULED_NOTIFICATION_TEST_DELAY_MS = 60 * 1000

const getScheduledNotificationTestDelayMs = (): number | undefined => {
  const fromEnv =
    process.env.HOUSING_BENEFITS_SCHEDULED_NOTIFICATION_TEST_DELAY_MS
  if (fromEnv) {
    const parsed = Number(fromEnv)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }
  if (isRunningOnEnvironment('local')) {
    return LOCAL_SCHEDULED_NOTIFICATION_TEST_DELAY_MS
  }
  return undefined
}

const HOUSING_BENEFITS_PRUNE_REMINDER_TEMPLATE_ID =
  'HNIPP.AS.HMS.HB.PRUNE.REMINDER'
const HOUSING_BENEFITS_PRUNED_TEMPLATE_ID = 'HNIPP.AS.HMS.HB.PRUNED'

type NotificationApplication = {
  id: string
  answers: FormValue
  externalData: ExternalData
}

/**
 * Address for HNIPP templates — required by Contentful for PRUNE.REMINDER.
 * Falls back to national registry when the rental contract has no property yet.
 */
const getNotificationAddress = (
  application: NotificationApplication,
): string => {
  const { rentalAddress } = getApplicationCardRentalSummary(
    application as Application,
  )
  if (rentalAddress.trim()) {
    return rentalAddress.trim()
  }

  const registryAddress = getValueViaPath<{
    streetAddress?: string | null
    postalCode?: string | null
    locality?: string | null
  }>(application.externalData, 'nationalRegistry.data.address')

  if (registryAddress) {
    const postalLocality = [
      registryAddress.postalCode,
      registryAddress.locality,
    ]
      .filter(Boolean)
      .join(' ')
    const formatted = [registryAddress.streetAddress, postalLocality]
      .filter(Boolean)
      .join(', ')
    if (formatted.trim()) {
      return formatted.trim()
    }
  }

  return '—'
}

const buildNotificationArgs = (
  application: NotificationApplication,
  daysRemaining?: number,
): Array<{ key: string; value: string }> => {
  const args: Array<{ key: string; value: string }> = [
    {
      key: 'expiryDate',
      value: getHousingBenefitsPruneDate(application).toISOString(),
    },
  ]

  args.push({ key: 'address', value: getNotificationAddress(application) })

  if (daysRemaining !== undefined) {
    args.push({ key: 'daysRemaining', value: String(daysRemaining) })
  }

  return args
}

export const getHousingBenefitsPruneMessage = (
  application: PruningApplication,
): PruningNotification => {
  return {
    notificationTemplateId: HOUSING_BENEFITS_PRUNED_TEMPLATE_ID,
    args: [{ key: 'address', value: getNotificationAddress(application) }],
  }
}

/**
 * When the reminder for the current state entry should be sent, or undefined
 * if the application would already be pruned by then.
 */
const getStateEntryReminderSendDate = (
  application: Application,
): Date | undefined => {
  const delayMs =
    getScheduledNotificationTestDelayMs() ??
    REMINDER_DAYS_AFTER_STATE_ENTRY * DAY_MS
  const sendDate = addMilliseconds(new Date(), delayMs)
  return sendDate < getHousingBenefitsPruneDate(application)
    ? sendDate
    : undefined
}

const applicantReminder = (
  application: Application,
  sendDate: Date,
): ScheduledNotificationConfig => ({
  template: HOUSING_BENEFITS_PRUNE_REMINDER_TEMPLATE_ID,
  date: sendDate,
  args: buildNotificationArgs(
    application,
    differenceInCalendarDays(
      getHousingBenefitsPruneDate(application),
      sendDate,
    ),
  ),
  includeApplicationLink: true,
})

/**
 * Reminds the applicant about the application, 5 days after entering the
 * state (used in assignee approval and applicant submit). Assignee approval is
 * re-entered whenever a household member signs or rejects, which restarts the
 * timer.
 */
export const getApplicantReminderScheduledNotifications = (
  application: Application,
): ScheduledNotificationConfig[] => {
  const sendDate = getStateEntryReminderSendDate(application)
  return sendDate ? [applicantReminder(application, sendDate)] : []
}

/**
 * Reminds the applicant to finish the draft 5 days after starting (40 days
 * before pruning) and again 5 days before pruning. The pre-prune reminder is
 * skipped if it would be sent in the past or not after the first reminder.
 */
export const getDraftReminderScheduledNotifications = (
  application: Application,
): ScheduledNotificationConfig[] => {
  const stateEntrySendDate = getStateEntryReminderSendDate(application)
  const beforePruneSendDate = addDays(
    getHousingBenefitsPruneDate(application),
    -DRAFT_REMINDER_DAYS_BEFORE_PRUNE,
  )

  const sendDates = [stateEntrySendDate]
  if (
    beforePruneSendDate > new Date() &&
    (!stateEntrySendDate || beforePruneSendDate > stateEntrySendDate)
  ) {
    sendDates.push(beforePruneSendDate)
  }

  return sendDates
    .filter((date): date is Date => !!date)
    .map((date) => applicantReminder(application, date))
}
