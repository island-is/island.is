import { Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import SubNavItem from './SubNavItem'
import * as styles from '../Sidebar.css'
interface Props {
  navChildren?: ServicePortalNavigationItem[]
  pathname?: string
  collapsed?: boolean
  onItemClick?: () => void
}

const SubNav = ({ navChildren, onItemClick, pathname, collapsed }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      className={collapsed ? styles.subnavCollapsed : styles.subnav}
      marginTop={collapsed ? 0 : 3}
    >
      <Stack space={2}>
        {navChildren?.map((child, index) => (
          <SubNavItem
            path={child.path}
            enabled={child.enabled}
            key={`child-${index}`}
            active={child.path && pathname?.includes(child.path) ? true : false}
            external={child.external}
            onClick={onItemClick}
          >
            {formatMessage(child.name)}
          </SubNavItem>
        ))}
      </Stack>
    </Box>
  )
}

export default SubNav
