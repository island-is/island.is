'use client'
import { ProviderInfo } from '../../lib/types'
import { getDocumentProviderNavigationItems } from '../../lib/navigation'
import { Navigation, NavigationItem } from '@island.is/island-ui/core'
import { DocumentProviderPaths } from '../../lib/paths'
import { useLocation } from 'react-router-dom'
import { useUserInfo } from '@island.is/react-spa/bff'

interface DocumentProvidersNavigationProps {
  providers: ProviderInfo[]
}

export const DocumentProvidersNavigation = ({
  providers,
}: DocumentProvidersNavigationProps) => {
  const location = useLocation()
  const user = useUserInfo()

  const dynamicChildren: NavigationItem[] =
    providers?.map((provider) => ({
      title: provider.name,
      href: DocumentProviderPaths.InstitutionDocumentProviderDocumentProvidersSingle.replace(
        ':providerId',
        provider.providerId,
      ),
    })) ?? []

  const nav = getDocumentProviderNavigationItems(
    dynamicChildren,
    location.pathname,
    user,
  )

  return (
    <div>
      <Navigation {...nav} />
    </div>
  )
}
