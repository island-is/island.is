import React from 'react'

import { Box, Icon, IconProps } from '@island.is/island-ui/core'

import * as styles from './UserMenu.css'

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
  return (
    <Box
      display="flex"
      height="full"
      alignItems="center"
      onClick={onClick}
      cursor="pointer"
      padding={1}
    >
      <Box display="flex" alignItems="center" marginRight={2}>
        <Icon
          type={icon.type}
          icon={icon.icon}
          size="medium"
          color={'blue400'}
        />
      </Box>

      {link ? (
        <a
          href={link}
          className={styles.delegationName}
          rel="noreferrer noopener"
        >
          {text}
        </a>
      ) : (
        <button className={styles.delegationName}>{text}</button>
      )}
    </Box>
  )
}
