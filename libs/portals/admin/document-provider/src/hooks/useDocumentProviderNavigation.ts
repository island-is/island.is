import { useMemo } from 'react'
import { useGetProvidersByNationalId } from '../shared/useGetProvidersByNationalId'
import { DocumentProviderPaths } from '../lib/paths'
import {
  baseDocumentProviderNavigation,
  documentProviderNavigationRoutes,
} from '../lib/navigation'
import { PortalNavigationItem } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

export const useDocumentProviderNavigation = (): PortalNavigationItem => {
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

  // Only fetch providers if user has institution scope
  const shouldFetchProviders = userInfo?.scopes?.includes(
    AdminPortalScope.documentProviderInstitution,
  )

  const { items: providers, loading } = useGetProvidersByNationalId(
    undefined,
    undefined,
    !shouldFetchProviders, // Skip the query if user doesn't have institution scope
  )

  return useMemo(() => {
    // If loading providers or no providers, return the base navigation
    if (loading || !userInfo) {
      return baseDocumentProviderNavigation
    }

    const shouldShowProvidersList = userInfo?.scopes?.includes(
      AdminPortalScope.documentProviderInstitution,
    )

    const shouldShowAdminRoutes = userInfo?.scopes?.includes(
      AdminPortalScope.documentProvider,
    )

    if (shouldShowAdminRoutes) {
      return {
        ...{
          ...baseDocumentProviderNavigation,
          children: documentProviderNavigationRoutes,
        },
      }
    } else if (shouldShowProvidersList) {
      const providerItems = (providers ?? []).map((provider) => ({
        name: provider.name,
        path: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle.replace(
          ':providerId',
          provider.providerId,
        ),
        systemRoute: true, // Mark as system route to prevent filtering
      }))

      return {
        ...baseDocumentProviderNavigation,
        children: [
          {
            name: formatMessage(m.providersList),
            path: DocumentProviderPaths.DocumentProviderOverview,
            children: providerItems,
            systemRoute: true, // Mark as system route to prevent filtering
          },
        ],
      }
    } else {
      return baseDocumentProviderNavigation
    }
  }, [providers, loading, userInfo, formatMessage])
}
