import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { DocumentProviderPaths } from './paths'
import cloneDeep from 'lodash/cloneDeep'
import { NavigationItem, NavigationProps } from '@island.is/island-ui/core'

export function getDocumentProviderNavigationItems(
  dynamicChildren: NavigationItem[],
  currentPath: string,
): NavigationProps {
  // Remove the first character from currentPath (e.g., '/')
  const normalizedPath =
    currentPath.length > 0 ? currentPath.substring(1) : currentPath

  // Helper to recursively mark active
  const markActive = (items: NavigationItem[]): NavigationItem[] =>
    items.map((item) => {
      const isActive = item.href === normalizedPath
      const newItems = item.items ? markActive(item.items) : []
      // If any child is active, parent is also active
      const childActive = newItems.some((child) => child.active)
      return {
        ...item,
        active: isActive || childActive ? true : undefined,
        items: newItems,
      }
    })

  const items: NavigationItem[] = [
    {
      title: 'Yfirlit',
      href: DocumentProviderPaths.DocumentProviderOverview,
      items: [],
    },
    {
      title: m.documentProviders.defaultMessage,
      href: '#',
      items: dynamicChildren,
    },
    {
      title: m.Settings.defaultMessage,
      href: DocumentProviderPaths.DocumentProviderSettings,
      items: [],
    },
  ]

  const navigation: NavigationProps = {
    title: m.rootName.defaultMessage,
    baseId: 'document-provider-navigation',
    expand: true,
    items: markActive(items),
  }

  console.log('Final Navigation items:', navigation)
  return navigation
}

export const documentProviderNavigation: PortalNavigationItem = {
  name: m.rootName,
  path: DocumentProviderPaths.DocumentProviderRoot,
  icon: {
    icon: 'receipt',
  },
  description: m.rootName,
  children: [
    {
      name: m.overview,
      path: DocumentProviderPaths.DocumentProviderOverview,
      icon: {
        icon: 'receipt',
      },
      description: m.overview,
    },
    {
      name: m.documentProviders,
      path: DocumentProviderPaths.DocumentProviderPaper,
      description: m.documentProviders,
    },
    {
      name: m.Settings,
      path: DocumentProviderPaths.DocumentProviderSettings,
      description: m.Settings,
    },
  ],
}
