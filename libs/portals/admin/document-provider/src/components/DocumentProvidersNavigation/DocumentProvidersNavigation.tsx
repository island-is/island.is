'use client'
import { ProviderInfo } from '../../lib/types'
import { getDocumentProviderNavigationItems } from '../../lib/navigation'
import { Navigation, NavigationItem } from '@island.is/island-ui/core'
import { DocumentProviderPaths } from '../../lib/paths'
import { useLocation } from 'react-router-dom'

interface DocumentProvidersNavigationProps {
  providers: ProviderInfo[]
}

export const DocumentProvidersNavigation = ({
  providers,
}: DocumentProvidersNavigationProps) => {
  const location = useLocation()

  const dynamicChildren: NavigationItem[] =
    providers?.map((provider) => ({
      title: provider.name,
      href: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle.replace(
        ':providerId',
        provider.providerId,
      ),
    })) ?? []

  const nav = getDocumentProviderNavigationItems(
    dynamicChildren,
    location.pathname,
  )

  return (
    <div>
      <Navigation {...nav} />
    </div>
  )
}
