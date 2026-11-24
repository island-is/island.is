import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_APPLICATION_TYPE_SETTINGS } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { stringHash } from '@island.is/shared/utils'

export const PREREQUISITES_STATE = 'prerequisites'
const GLOBAL_APPLICATION_TYPE = '*'

// TODO: generate these interfaces with graphql codegen
export interface ApplicationTypeAlertBanner {
  id: string
  showAlertBanner: boolean
  bannerVariant: string
  title?: string | null
  description?: string | null
  linkTitle?: string | null
  link?: { slug: string; type: string } | null
  isDismissable: boolean
  dismissedForDays: number
}

export interface ApplicationTypeSettings {
  id: string
  applicationType: string
  disableLeavingPrerequisites: boolean
  blockedTitle?: string | null
  blockedMessage?: string | null
  alertBanner?: ApplicationTypeAlertBanner | null
}

export interface ApplicationTypeBanner extends ApplicationTypeAlertBanner {
  bannerId: string
}

export interface LeavingPrerequisitesBlock {
  blockedTitle: string | null
  blockedMessage: string | null
}

export interface ResolvedApplicationTypeSettings {
  banners: ApplicationTypeBanner[]
  leavingPrerequisitesBlock: LeavingPrerequisitesBlock | null
}

interface GetApplicationTypeSettingsResponse {
  getApplicationTypeSettings: ApplicationTypeSettings[]
}

export const getApplicationTypeBannerId = (
  banner: ApplicationTypeAlertBanner,
) => `application-alert-${stringHash(JSON.stringify(banner))}`

/** Global settings come first so type specific ones take precedence */
const byPriority = (settings: ApplicationTypeSettings[]) =>
  [...settings].sort(
    (a, b) =>
      Number(b.applicationType === GLOBAL_APPLICATION_TYPE) -
      Number(a.applicationType === GLOBAL_APPLICATION_TYPE),
  )

export const resolveApplicationTypeSettings = (
  settings: ApplicationTypeSettings[],
): ResolvedApplicationTypeSettings => {
  const sorted = byPriority(settings)

  const banners = sorted
    .map((s) => s.alertBanner)
    .filter((banner): banner is ApplicationTypeAlertBanner =>
      Boolean(banner?.showAlertBanner),
    )
    .map((banner) => ({
      ...banner,
      bannerId: getApplicationTypeBannerId(banner),
    }))

  const blocking = sorted.filter((s) => s.disableLeavingPrerequisites).reverse()

  const leavingPrerequisitesBlock =
    blocking.length > 0
      ? {
          blockedTitle:
            blocking.find((s) => s.blockedTitle)?.blockedTitle ?? null,
          blockedMessage:
            blocking.find((s) => s.blockedMessage)?.blockedMessage ?? null,
        }
      : null

  return { banners, leavingPrerequisitesBlock }
}

/**
 * Fetches the CMS settings (alert banners and blocks) for an application type.
 * Fails open: if the settings can not be fetched nothing is shown or blocked.
 */
export const useApplicationTypeSettings = (
  applicationType?: string,
): ResolvedApplicationTypeSettings => {
  const { lang } = useLocale()

  const { data } = useQuery<GetApplicationTypeSettingsResponse>(
    GET_APPLICATION_TYPE_SETTINGS,
    {
      variables: { input: { applicationType, lang } },
      skip: !applicationType,
      fetchPolicy: 'cache-and-network',
    },
  )

  return useMemo(
    () =>
      resolveApplicationTypeSettings(data?.getApplicationTypeSettings ?? []),
    [data],
  )
}
