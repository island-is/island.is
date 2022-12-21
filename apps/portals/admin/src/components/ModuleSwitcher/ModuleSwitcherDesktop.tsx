import React from 'react'
import { Menu, MenuButton, useMenuState } from 'reakit/Menu'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/admin/core'
import { useActiveModule } from '@island.is/portals/core'

import { rootNavigationItem } from '../../lib/masterNavigation'
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
      <MenuButton
        className={styles.menuButton}
        {...menu}
        as="div"
        aria-label={formatMessage(m.openModuleSwitcherAria)}
      >
        <Box
          component="div"
          display="flex"
          justifyContent="spaceBetween"
          paddingX={3}
        >
          <Box>
            <Text variant="eyebrow">{formatMessage(m.shortTitle)}</Text>
            <Text>
              {formatMessage(
                activeModule ? activeModule.name : rootNavigationItem.name,
              )}
            </Text>
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              colorScheme="negative"
              circle
              size="small"
              icon="chevronDown"
              aria-hidden
            />
          </Box>
        </Box>
      </MenuButton>

      <Menu
        {...menu}
        className={styles.menuDropdown}
        aria-label={formatMessage(m.moduleSwitcherAria)}
      >
        <Box background="white" paddingTop={3} padding={2} borderRadius="large">
          <Box
            marginBottom={4}
            paddingX={1}
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
          >
            <Text variant="eyebrow">{formatMessage(m.shortTitle)}</Text>
            <Button
              circle
              size="small"
              colorScheme="light"
              icon="close"
              onClick={menu.hide}
              aria-label={formatMessage(m.closeModuleSwitcherAria)}
            />
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
