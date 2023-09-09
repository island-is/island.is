import { useLocale, useNamespaces, isLocale } from '@island.is/localization'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@island.is/auth/react'
import { useGetUserProfileLocaleLazyQuery } from '../../../gen/graphql'

/**
 * If the user has set a preferred language in his user
 * profile that is not the default language on startup,
 * set the current language to that one.
 * Note: This is a temporary solution, the preferred
 * language should be fetched by the auth server and returned
 * with the userInfo token in the future.
 */
export const UserProfileLocale = () => {
  const { changeLanguage } = useNamespaces()
  const { lang } = useLocale()
  const { userInfo } = useAuth()
  const [getUserProfile, { data }] = useGetUserProfileLocaleLazyQuery()
  const location = useLocation()

  const userProfile = data?.getUserProfileLocale || null

  useEffect(() => {
    if (userInfo?.profile.nationalId) getUserProfile()
  }, [userInfo, getUserProfile])

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const requestedLocale = query.get('locale') ?? userProfile?.locale
    if (
      requestedLocale &&
      isLocale(requestedLocale) &&
      requestedLocale !== lang
    )
      changeLanguage(requestedLocale)
  }, [userProfile])

  return null
}
