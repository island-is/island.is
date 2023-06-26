import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { HealthPaths } from './paths'

export const healthNavigation: PortalNavigationItem = {
  name: m.health,
  path: HealthPaths.HealthRoot,
  icon: {
    icon: 'heart',
  },
  children: [
    {
      name: m.therapies,
      path: HealthPaths.HealthTherapies,
    },
    {
      name: m.aidsAndNutrition,
      path: HealthPaths.HealthAidsAndNutrition,
    },
    {
      name: m.dentists,
      path: HealthPaths.HealthDentists,
    },
    {
      name: m.healthCenter,
      path: HealthPaths.HealthCenter,
    },
  ],
  description: m.healthDescription,
}
