import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_APPLICATION_TYPE_SETTINGS } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { stringHash } from '@island.is/shared/utils'

const GLOBAL_APPLICATION_TYPE = '*'

// These interfaces mirror the fields selected in GET_APPLICATION_TYPE_SETTINGS.
// Keep them in sync with that query.
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
  alertBanner?: ApplicationTypeAlertBanner | null
}

export interface ApplicationTypeBanner extends ApplicationTypeAlertBanner {
  bannerId: string
}

export interface ResolvedApplicationTypeSettings {
  banners: ApplicationTypeBanner[]
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

  return { banners }
}

/**
 * Fetches the CMS settings (alert banners) for an application type.
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
