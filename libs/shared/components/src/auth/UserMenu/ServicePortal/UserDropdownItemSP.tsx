import React, { Dispatch, SetStateAction } from 'react'

import {
  Box,
  Button,
  Select,
  Stack,
  Text,
  ModalBase,
  UserAvatar,
  Icon,
  GridContainer,
  Option,
  Divider,
  Link as ILink,
  IconProps,
} from '@island.is/island-ui/core'

import { Link } from 'react-router-dom'

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
      onClick={onClick && onClick}
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
        <Link to={link}>
          <Text variant="sidebar">{text}</Text>
        </Link>
      ) : (
        <Text variant="sidebar" fontWeight="regular">
          {text}
        </Text>
      )}
    </Box>
  )
}
