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
 * On startup we adopt the user's preferred language so the SDF app doesn't stay
 * stuck on the `LocaleProvider` default ('is'). We resolve the locale from, in
 * order of precedence:
 *   1. a `?locale=` deep-link override,
 *   2. the live user-profile value from `getUserProfileLocale` (reflects a
 *      just-persisted language switch), and
 *   3. `userInfo.profile.locale` straight off the BFF id token — instant and
 *      scope-free, so it still works on a hard refresh even if the query is
 *      unavailable (e.g. missing user-profile read scope).
 *
 * The screen itself reacts to the resulting locale change via `useFormActions`.
 * Renders nothing.
 */
export const AppUserProfileLocale = () => {
  const { lang, changeLanguage } = useLocale()
  const userInfo = useUserInfo()
  const [getUserProfile, { data }] =
    useLazyQuery<GetUserProfileLocaleData>(GET_USER_PROFILE_LOCALE)

  const tokenLocale = userInfo?.profile.locale ?? null
  const profileLocale = data?.getUserProfileLocale?.locale ?? null

  useEffect(() => {
    if (userInfo?.profile.nationalId) {
      getUserProfile()
    }
  }, [userInfo?.profile.nationalId, getUserProfile])

  useEffect(() => {
    // `?locale=` (e.g. a deep link) takes precedence. Read it lazily from the
    // URL to avoid pulling `useSearchParams`, which would de-opt the route to
    // client-only rendering.
    const override =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('locale')
        : null
    const requestedLocale = override ?? profileLocale ?? tokenLocale ?? null

    if (
      requestedLocale &&
      isLocale(requestedLocale) &&
      requestedLocale !== lang
    ) {
      changeLanguage(requestedLocale)
    }
    // Re-evaluate only when a locale *source* resolves (token on auth, profile
    // on query) — never on a plain `lang` change — so we don't fight an
    // in-session toggle from the language switcher.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLocale, tokenLocale])

  return null
}
