import { readFileSync } from 'fs'
import { resolve } from 'path'
import { logger } from '@island.is/logging'
import {
  APPLICATION_TYPE_SETTINGS_GLOBAL_TYPE,
  ApplicationTypeSettings,
  sortApplicationTypeSettings,
} from './models/applicationTypeSettings.model'
import { AlertBanner } from './models/alertBanner.model'

export const APPLICATION_TYPE_SETTINGS_MOCK_FILE_ENV =
  'APPLICATION_TYPE_SETTINGS_MOCK_FILE'

type LocalAlertBanner = Partial<AlertBanner>
type LocalApplicationTypeSettings = Partial<
  Omit<ApplicationTypeSettings, 'alertBanner'>
> & {
  applicationType: string
  alertBanner?: LocalAlertBanner | null
}

const toAlertBanner = (
  banner: LocalAlertBanner,
  fallbackId: string,
): AlertBanner => ({
  id: banner.id ?? fallbackId,
  showAlertBanner: banner.showAlertBanner ?? true,
  bannerVariant: banner.bannerVariant ?? 'warning',
  title: banner.title ?? '',
  description: banner.description ?? '',
  linkTitle: banner.linkTitle ?? '',
  link: banner.link ?? null,
  isDismissable: banner.isDismissable ?? true,
  dismissedForDays: banner.dismissedForDays ?? 0,
  servicePortalPaths: [],
})

const toApplicationTypeSettings = (
  settings: LocalApplicationTypeSettings,
  index: number,
): ApplicationTypeSettings => {
  const id = settings.id ?? `local-application-type-settings-${index}`
  return {
    id,
    applicationType: settings.applicationType,
    alertBanner: settings.alertBanner
      ? toAlertBanner(settings.alertBanner, `${id}-alert-banner`)
      : null,
    disableLeavingPrerequisites: settings.disableLeavingPrerequisites ?? false,
    blockedTitle: settings.blockedTitle ?? null,
    blockedMessage: settings.blockedMessage ?? null,
  }
}

/**
 * Local development only. When APPLICATION_TYPE_SETTINGS_MOCK_FILE points to a JSON file
 * (an array of settings), it is used instead of Contentful. The file is read on every call
 * so changes take effect without a restart. Ignored when NODE_ENV is production.
 *
 * Returns null when the override is not active.
 */
export const getLocalApplicationTypeSettingsOverride = (
  applicationType: string,
): ApplicationTypeSettings[] | null => {
  const file = process.env[APPLICATION_TYPE_SETTINGS_MOCK_FILE_ENV]

  if (!file || process.env.NODE_ENV === 'production') {
    return null
  }

  try {
    const content = JSON.parse(
      readFileSync(resolve(file), 'utf8'),
    ) as LocalApplicationTypeSettings[]

    if (!Array.isArray(content)) {
      throw new Error('Expected the file to contain an array of settings')
    }

    return sortApplicationTypeSettings(
      content
        .map(toApplicationTypeSettings)
        .filter(
          (settings) =>
            settings.applicationType ===
              APPLICATION_TYPE_SETTINGS_GLOBAL_TYPE ||
            settings.applicationType === applicationType,
        ),
    )
  } catch (error) {
    logger.warn(
      `Could not read local application type settings from ${file}, returning no settings`,
      { error },
    )
    return []
  }
}
