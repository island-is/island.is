import { PortalNavigationItem } from '@island.is/portals/core'
import { FormSystemPaths } from './paths'
import { m } from '@island.is/form-system/ui'

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
