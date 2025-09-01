'use client'
import { ProviderInfo } from '../../lib/types'
import { getDocumentProviderNavigationItems } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { Navigation, NavigationItem } from '@island.is/island-ui/core'
import { DocumentProviderPaths } from '../../lib/paths'
import { useParams, useLocation } from 'react-router-dom'

interface DocumentProvidersNavigationProps {
  providers: ProviderInfo[]
}

const findActiveNav = (
  navigation?: NavigationItem,
): NavigationItem | undefined => {
  if (!navigation) {
    return undefined
  }
  const activeChild = navigation.items?.find((item) => item.active)
  return findActiveNav(activeChild) || activeChild
}

export function DocumentProvidersNavigation({
  providers,
}: DocumentProvidersNavigationProps) {
  const { formatMessage } = useLocale()
  const params = useParams()
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
