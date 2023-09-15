import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { IcelandicNamesRegistryPaths } from './paths'

export const icelandicNamesRegistryNavigation: PortalNavigationItem = {
  name: m.rootName,
  path: IcelandicNamesRegistryPaths.IcelandicNamesRegistryRoot,
  icon: {
    icon: 'fileTrayFull',
  },
  description: m.description,
}
