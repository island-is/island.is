'use client'
import { ProviderInfo } from '../../lib/types'
import { m } from '../../lib/messages'
import { getDocumentProviderNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { PortalNavigation, PortalNavigationItem } from '@island.is/portals/core'

interface DocumentProvidersNavigationProps {
  dynamicChildren: {
    name: string
    path: string
    description: string
  }[]
}

export function DocumentProvidersNavigationSub({
  dynamicChildren,
}: DocumentProvidersNavigationProps) {
  const { formatMessage } = useLocale()

  const documentProviderNavigation = getDocumentProviderNavigation(
    dynamicChildren as PortalNavigationItem[],
  )

  return (
    <div>
      <PortalNavigation
        navigation={documentProviderNavigation}
        title={formatMessage(m.documentProviders)}
      />
    </div>
  )
}
