import { useMemo } from 'react'
import { useGetProvidersByNationalId } from '../shared/useGetProvidersByNationalId'
import { DocumentProviderPaths } from '../lib/paths'
import { documentProviderNavigation } from '../lib/navigation'
import { PortalNavigationItem } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { useUserInfo } from '@island.is/react-spa/bff'

export const useDocumentProviderNavigation = (): PortalNavigationItem => {
  const userInfo = useUserInfo()
  const { items: providers, loading } = useGetProvidersByNationalId(
    undefined,
    undefined,
  )

  return useMemo(() => {
    // If loading or no providers, return the base navigation
    if (loading || !providers || providers.length === 0) {
      return documentProviderNavigation
    }

    const providerItems = providers.map((provider) => ({
      name: provider.name,
      path: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle.replace(
        ':providerId',
        provider.providerId,
      ),
      systemRoute: true, // Mark as system route to prevent filtering
    }))

    // Filter navigation items based on user scopes
    const filteredChildren = (documentProviderNavigation.children || []).filter(
      (item) => {
        // Always show overview
        if (item.path === DocumentProviderPaths.DocumentProviderOverview) {
          return true
        }

        // Only show paper and categories for admin users
        if (
          item.path === DocumentProviderPaths.DocumentProviderPaper ||
          item.path === DocumentProviderPaths.DocumentProviderCategoryAndType
        ) {
          return userInfo?.scopes?.includes(
            AdminPortalScope.documentProviderAdmin,
          )
        }

        // Hide the template single provider route
        if (
          item.path ===
          DocumentProviderPaths.DocumentProviderDocumentProvidersSingle
        ) {
          return false
        }

        return true
      },
    )

    return {
      ...documentProviderNavigation,
      children: [
        ...filteredChildren,
        {
          name: 'Skjalaveitendur',
          path: DocumentProviderPaths.DocumentProviderOverview,
          children: providerItems,
          systemRoute: true, // Mark as system route to prevent filtering
        },
      ],
    }
  }, [providers, loading, userInfo])
}
