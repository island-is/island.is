import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { FormSystemPaths } from './paths'

export const formSystemNavigation: PortalNavigationItem = {
  name: m.rootName,
  icon: {
    icon: 'settings',
  },
  description: m.rootName,
  path: FormSystemPaths.FormSystemRoot,
  children: [
    {
      name: m.rootName,
      path: FormSystemPaths.Form,
      activeIfExact: true,
    },
  ],
}
