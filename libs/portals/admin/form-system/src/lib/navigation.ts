import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { FormSystemPaths } from './paths'

export const formSystemNavigation: PortalNavigationItem = {
  name: m.formSystemTitle,
  icon: {
    icon: 'settings',
  },
  description: m.formSystemIntro,
  path: FormSystemPaths.FormSystemRoot,
  children: [
    {
      name: m.formSystemTitle,
      path: FormSystemPaths.Form,
      activeIfExact: true,
    },
  ],
}
