import {
  useNavigation,
  useModules,
  ModuleIdentifiers,
} from '@island.is/portals/core'
import partition from 'lodash/partition'

export const useAdminNavigation = () => {
  const navigation = useNavigation()
  const modules = useModules()

  const [bottomNavigation, topNavigation] = partition(
    navigation?.children || [],
    (navItem) =>
      navItem.id &&
      Object.values(ModuleIdentifiers).includes(
        navItem.id as ModuleIdentifiers,
      ),
  )

  const filteredBottomNavigation = bottomNavigation.filter((item) => {
    if (item.id === ModuleIdentifiers.DELEGATIONS) {
      // If modules do not contain delegations module, i.e. user does not have access to it,
      // then we filter it out bottom navigation.
      return modules.some(
        ({ id }) => id && id === ModuleIdentifiers.DELEGATIONS,
      )
    }

    return true
  })

  return {
    topNavigation,
    bottomNavigation: filteredBottomNavigation,
  }
}
