import { Menu, MenuButton, useMenuState } from 'reakit/Menu'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/admin/core'
import {
  SingleNavigationItemStatus,
  useActiveModule,
  useSingleNavigationItem,
} from '@island.is/portals/core'

import { BOTTOM_NAVIGATION, TOP_NAVIGATION } from '../../lib/masterNavigation'
import { ModuleSwitcherHeader } from './ModuleSwitcherHeader'
import { ModuleSwitcherItems } from './ModuleSwitcherItems'

import * as styles from './ModuleSwitcherDesktop.css'

export const ModuleSwitcherDesktop = () => {
  const menu = useMenuState({
    placement: 'top-start',
    unstable_offset: [0, -60],
  })
  const { formatMessage } = useLocale()
  const activeModule = useActiveModule()
  const { status } = useSingleNavigationItem(TOP_NAVIGATION, BOTTOM_NAVIGATION)
  const isStaticSwitcher = status !== SingleNavigationItemStatus.MULTIPLE_ITEMS

  return (
    <div
      className={
        styles.container[
          isStaticSwitcher && !activeModule ? 'skipRightBorder' : 'normal'
        ]
      }
    >
      {isStaticSwitcher ? (
        <ModuleSwitcherHeader isStaticSwitcher />
      ) : (
        <>
          <MenuButton
            className={styles.menuButton}
            {...menu}
            as="div"
            aria-label={formatMessage(m.openModuleSwitcherAria)}
          >
            <ModuleSwitcherHeader />
          </MenuButton>

          <Menu
            {...menu}
            className={styles.menuDropdown}
            aria-label={formatMessage(m.moduleSwitcherAria)}
          >
            <Box
              background="white"
              paddingTop={3}
              padding={2}
              borderRadius="default"
            >
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
        </>
      )}
    </div>
  )
}
