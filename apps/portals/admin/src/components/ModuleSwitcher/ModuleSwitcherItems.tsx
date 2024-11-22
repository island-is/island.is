import React from 'react'
import { Link } from 'react-router-dom'

import { Box, Icon, IconMapIcon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, useActiveModule, useNavigation } from '@island.is/portals/core'

import {
  rootNavigationItem,
  BOTTOM_NAVIGATION,
  TOP_NAVIGATION,
} from '../../lib/masterNavigation'

import * as styles from './ModuleSwitcherItems.css'

interface ModuleItemsProps {
  mobile?: boolean
  onNavigation(): void
}

interface ModuleItemProps {
  label: string
  path: string
  icon?: IconMapIcon
  active?: boolean
  key?: string | number
}

export const ModuleSwitcherItems = ({
  mobile,
  onNavigation,
}: ModuleItemsProps) => {
  const activeModule = useActiveModule()
  const topNavigation = useNavigation(TOP_NAVIGATION)
  const bottomNavigation = useNavigation(BOTTOM_NAVIGATION)
  const { formatMessage } = useLocale()

  const ModuleSwitcherItem = ({
    label,
    path,
    icon = 'settings',
    active = false,
    key,
  }: ModuleItemProps) => {
    const color = active ? 'blue400' : 'blue600'

    return (
      <Link to={path} onClick={onNavigation} className={styles.link}>
        <Box
          key={key}
          paddingX={mobile ? 3 : 2}
          paddingY={mobile ? 2 : 1}
          display="flex"
          alignItems="center"
          background={active && mobile ? 'white' : undefined}
          borderRadius="default"
          className={!mobile && styles.itemHover}
        >
          <Icon
            icon={icon}
            type={active ? 'filled' : 'outline'}
            color={color}
            size="small"
          />
          <Box marginLeft={3}>
            <Text
              color={color}
              variant={mobile ? 'h3' : 'medium'}
              fontWeight={!mobile && active ? 'semiBold' : undefined}
            >
              {label}
            </Text>
          </Box>
        </Box>
      </Link>
    )
  }

  const navigationItems = (topNavigation?.children ?? []).concat(
    bottomNavigation?.children ?? [],
  )

  return (
    <>
      <Box marginBottom={1}>
        <ModuleSwitcherItem
          path={rootNavigationItem?.path ?? '/'}
          label={formatMessage(m.overview)}
          icon="home"
          active={!activeModule}
        />
      </Box>

      <Stack space={mobile ? 0 : 1} dividers={false}>
        {navigationItems.map((item, index) =>
          item.path ? (
            <ModuleSwitcherItem
              key={index}
              label={formatMessage(item.name)}
              path={item.path}
              icon={item.icon?.icon}
              active={item.active}
            />
          ) : null,
        )}
      </Stack>
    </>
  )
}
