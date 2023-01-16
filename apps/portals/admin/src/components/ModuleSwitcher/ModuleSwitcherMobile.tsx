import { Dialog, DialogDisclosure, useDialogState } from 'reakit/Dialog'

import { Box, Button, Logo, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/admin/core'
import {
  SingleNavigationItemStatus,
  useSingleNavigationItem,
} from '@island.is/portals/core'

import { BOTTOM_NAVIGATION, TOP_NAVIGATION } from '../../lib/masterNavigation'
import { ModuleSwitcherHeader } from './ModuleSwitcherHeader'
import { ModuleSwitcherItems } from './ModuleSwitcherItems'

import * as styles from './ModuleSwitcherMobile.css'

export const ModuleSwitcherMobile = () => {
  const dialog = useDialogState()
  const { formatMessage } = useLocale()
  const { status } = useSingleNavigationItem(TOP_NAVIGATION, BOTTOM_NAVIGATION)
  const isStaticSwitcher = status !== SingleNavigationItemStatus.MULTIPLE_ITEMS

  return (
    <Box display="flex" marginLeft={2}>
      {isStaticSwitcher ? (
        <ModuleSwitcherHeader mobile isStaticSwitcher />
      ) : (
        <>
          <DialogDisclosure
            {...dialog}
            as="div"
            aria-label={formatMessage(m.openModuleSwitcherAria)}
          >
            <ModuleSwitcherHeader mobile />
          </DialogDisclosure>
          <Dialog {...dialog} aria-label={formatMessage(m.moduleSwitcherAria)}>
            <Box className={styles.dialogContainer}>
              <Box
                className={styles.dialogHeader}
                display="flex"
                justifyContent="spaceBetween"
                marginBottom={2}
              >
                <Box display="flex" alignItems="center">
                  <Logo width={40} iconOnly />
                  <Box marginLeft={2}>
                    <Text variant="h4">{formatMessage(m.title)}</Text>
                  </Box>
                </Box>
                <Button
                  circle
                  colorScheme="light"
                  icon="close"
                  iconType="outline"
                  onClick={dialog.hide}
                  aria-label={formatMessage(m.closeModuleSwitcherAria)}
                />
              </Box>

              <ModuleSwitcherItems mobile onNavigation={dialog.hide} />
            </Box>
          </Dialog>
        </>
      )}
    </Box>
  )
}
