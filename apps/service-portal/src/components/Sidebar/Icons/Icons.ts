import { IconProps } from '@island.is/island-ui/core'

export const getIconFromType = (
  icon: Pick<IconProps, 'icon' | 'type'>,
): string | undefined => {
  switch (icon.icon) {
    case 'cellular':
      return './assets/icons/sidebar/cellular.svg'
      break
    case 'home':
      return './assets/icons/sidebar/home.svg'
      break
    case 'lockClosed':
      return './assets/icons/sidebar/lockClosed.svg'
      break
    case 'school':
      return './assets/icons/sidebar/school.svg'
      break
    case 'logOut':
      return './assets/icons/sidebar/logOut.svg'
      break
    default:
      return undefined
      break
  }
}
