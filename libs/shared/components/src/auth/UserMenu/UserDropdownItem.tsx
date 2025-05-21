import { FocusableBox, Box, Icon, IconProps } from '@island.is/island-ui/core'

import * as styles from './UserMenu.css'
import { ElementType } from 'react'

interface UserDropdownItemProps {
  text: string
  icon: Pick<IconProps, 'icon' | 'type'>
  link?: string
  onClick?: () => void
}

export const UserDropdownItem = ({
  text,
  icon,
  link,
  onClick,
}: UserDropdownItemProps) => {
  const extraProps = {
    link: {
      rel: 'noreferrer noopener',
      href: link,
    },
    button: {
      component: 'button' as ElementType,
    },
  }

  return (
    <FocusableBox
      display="flex"
      height="full"
      alignItems="center"
      className={styles.dropdownItem}
      onClick={onClick}
      cursor="pointer"
      padding={1}
      {...extraProps[link ? 'link' : 'button']}
    >
      <Box display="flex" alignItems="center" marginRight={2}>
        <Icon
          type={icon.type}
          icon={icon.icon}
          size="medium"
          color={'blue400'}
        />
      </Box>
      <Box className={styles.delegationName}>{text}</Box>
    </FocusableBox>
  )
}
