import React from 'react'
import { Menu, MenuButton, useMenuState } from 'reakit/Menu'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/admin/core'
import { useActiveModule } from '@island.is/portals/core'

import { masterNavigation } from '../../lib/masterNavigation'
import { ModuleSwitcherItems } from './ModuleSwitcherItems'

import * as styles from './ModuleSwitcherDesktop.css'

export const ModuleSwitcherDesktop = () => {
  const menu = useMenuState({
    placement: 'top-start',
    unstable_offset: [0, -60],
  })
  const { formatMessage } = useLocale()
  const activeModule = useActiveModule()

  return (
    <div className={styles.container}>
      <MenuButton className={styles.menuButton} {...menu} as="div">
        <Box
          component="div"
          display="flex"
          justifyContent="spaceBetween"
          paddingX={3}
        >
          <Box>
            <Text variant="eyebrow">{formatMessage(m.dashboard)}</Text>
            <Text>
              {formatMessage(
                activeModule ? activeModule.name : masterNavigation.name,
              )}
            </Text>
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              colorScheme="light"
              circle={true}
              size="small"
              icon="chevronDown"
            ></Button>
          </Box>
        </Box>
      </MenuButton>

      <Menu
        {...menu}
        className={styles.menuDropdown}
        aria-label={formatMessage(m.moduleSwitcher)}
      >
        <Box background="white" paddingTop={3} padding={2} borderRadius="large">
          <Box
            marginBottom={4}
            paddingX={1}
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
          >
            <Text variant="eyebrow">{formatMessage(m.dashboard)}</Text>
            <Button
              circle
              size="small"
              colorScheme="light"
              icon="close"
              onClick={menu.hide}
            ></Button>
          </Box>

          <ModuleSwitcherItems onNavigation={menu.hide} />
        </Box>
      </Menu>
      <Box
        display={menu.visible ? 'block' : 'none'}
        className={styles.backdrop}
      />
    </div>
  )
}
