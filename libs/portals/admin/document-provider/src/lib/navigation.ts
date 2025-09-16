import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { DocumentProviderPaths } from './paths'
import { NavigationItem, NavigationProps } from '@island.is/island-ui/core'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { BffUser } from '@island.is/shared/types'

export const getDocumentProviderNavigationItems = (
  dynamicChildren: NavigationItem[],
  currentPath: string,
  user?: BffUser,
): NavigationProps => {
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

  let items: NavigationItem[] = [
    {
      title: 'Yfirlit',
      href: DocumentProviderPaths.DocumentProviderOverview,
      items: [],
    },
    {
      title: m.documentProviders.defaultMessage,
      href: DocumentProviderPaths.InstitutionDocumentProviderOverview,
      items: dynamicChildren,
    },
    {
      title: m.paper.defaultMessage,
      href: DocumentProviderPaths.DocumentProviderPaper,
      items: [],
    },
    {
      title: m.catAndTypeName.defaultMessage,
      href: DocumentProviderPaths.DocumentProviderCategoryAndType,
      items: [],
    },
  ]

  // Filter items based on user claims
  if (user?.scopes?.includes(AdminPortalScope.documentProviderInstitution)) {
    items = items.filter(
      (item) => item.title === m.documentProviders.defaultMessage,
    )
  } else if (user?.scopes?.includes(AdminPortalScope.documentProvider)) {
    items = items.filter(
      (item) => item.title !== m.documentProviders.defaultMessage,
    )
  }

  const navigation: NavigationProps = {
    title: m.rootName.defaultMessage,
    baseId: 'document-provider-navigation',
    expand: true,
    items: markActive(items),
  }

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
