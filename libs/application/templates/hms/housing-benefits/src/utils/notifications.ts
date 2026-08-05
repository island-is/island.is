import addDays from 'date-fns/addDays'
import { getSlugFromType, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  ExternalData,
  FormValue,
  PruningApplication,
  PruningNotification,
  ScheduledNotificationConfig,
} from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { getApplicationCardRentalSummary } from './applicationCardSummary'
import { getHousingBenefitsPruneDate } from './pruneUtils'

export const PRUNE_REMINDER_DAYS_BEFORE = 7

/** Local testing only — single reminder 1 minute after entering draft. */
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

const getApplicationPath = (application: NotificationApplication): string =>
  `/${getSlugFromType(ApplicationTypes.HOUSING_BENEFITS)}/${application.id}`

const getApplicationLink = (application: NotificationApplication): string => {
  const path = getApplicationPath(application)
  const origin = (
    process.env.CLIENT_LOCATION_ORIGIN ??
    `http://localhost:${process.env.WEB_FRONTEND_PORT ?? '4242'}/umsoknir`
  ).replace(/\/$/, '')
  return `${origin}${path}`
}

const buildNotificationArgs = (
  application: NotificationApplication,
  daysRemaining?: number,
): Array<{ key: string; value: string }> => {
  const args: Array<{ key: string; value: string }> = [
    {
      key: 'applicationLink',
      value: getApplicationLink(application),
    },
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

export const getDraftPruneReminderScheduledNotifications = (
  application: Application,
): ScheduledNotificationConfig[] => {
  const templateId = HOUSING_BENEFITS_PRUNE_REMINDER_TEMPLATE_ID

  const testDelayMs = getScheduledNotificationTestDelayMs()
  if (testDelayMs) {
    return [
      {
        template: templateId,
        delayInMs: testDelayMs,
        args: buildNotificationArgs(application, PRUNE_REMINDER_DAYS_BEFORE),
      },
    ]
  }

  const pruneDate = getHousingBenefitsPruneDate(application)

  return Array.from({ length: PRUNE_REMINDER_DAYS_BEFORE }, (_, index) => {
    const daysRemaining = PRUNE_REMINDER_DAYS_BEFORE - index

    return {
      template: templateId,
      date: addDays(pruneDate, -daysRemaining),
      args: buildNotificationArgs(application, daysRemaining),
    }
  })
}
