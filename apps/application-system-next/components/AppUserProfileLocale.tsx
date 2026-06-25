'use client'

import { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { isLocale, useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'

const GET_USER_PROFILE_LOCALE = gql`
  query GetUserProfileLocale {
    getUserProfileLocale {
      nationalId
      locale
    }
  }
`

interface GetUserProfileLocaleData {
  getUserProfileLocale?: {
    nationalId: string
    locale?: string | null
  } | null
}

/**
 * App-Router counterpart of the shared `UserProfileLocale` component, which
 * cannot run here because it depends on react-router's `useLocation`.
 *
 * On startup we adopt the user's preferred language: if the profile locale (or
 * a `?locale=` query override) differs from the active language, switch to it.
 * `LocaleProvider` always boots in the default language ('is'), so without this
 * the SDF app would ignore the user's saved preference. The screen itself reacts
 * to the resulting locale change via `useFormActions`.
 *
 * Renders nothing.
 */
export const AppUserProfileLocale = () => {
  const { lang, changeLanguage } = useLocale()
  const userInfo = useUserInfo()
  const [getUserProfile, { data }] = useLazyQuery<GetUserProfileLocaleData>(
    GET_USER_PROFILE_LOCALE,
  )

  const userProfile = data?.getUserProfileLocale ?? null

  useEffect(() => {
    if (userInfo?.profile.nationalId) {
      getUserProfile()
    }
  }, [userInfo?.profile.nationalId, getUserProfile])

  useEffect(() => {
    // `?locale=` (e.g. a deep link) takes precedence over the saved profile
    // locale. Read it lazily from the URL to avoid pulling `useSearchParams`,
    // which would de-opt the route to client-only rendering.
    const override =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('locale')
        : null
    const requestedLocale = override ?? userProfile?.locale ?? null

    if (
      requestedLocale &&
      isLocale(requestedLocale) &&
      requestedLocale !== lang
    ) {
      changeLanguage(requestedLocale)
    }
    // Mirrors the shared component: only react to the resolved profile locale,
    // not to every `lang`/`changeLanguage` identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile])

  return null
}
