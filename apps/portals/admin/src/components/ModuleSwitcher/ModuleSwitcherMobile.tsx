import React from 'react'
import { Dialog, DialogDisclosure, useDialogState } from 'reakit/Dialog'

import {
  Box,
  Button,
  FocusableBox,
  Logo,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/admin/core'
import { useActiveModule } from '@island.is/portals/core'

import { rootNavigationItem } from '../../lib/masterNavigation'
import { ModuleSwitcherItems } from './ModuleSwitcherItems'

import * as styles from './ModuleSwitcherMobile.css'

export const ModuleSwitcherMobile = () => {
  const dialog = useDialogState()
  const activeModule = useActiveModule()
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" marginLeft={2}>
      <DialogDisclosure
        {...dialog}
        as="div"
        aria-label={formatMessage(m.openModuleSwitcherAria)}
      >
        <FocusableBox
          component="div"
          width="full"
          display="flex"
          justifyContent="spaceBetween"
        >
          <Box>
            <Text variant="eyebrow">{formatMessage(m.shortTitle)}</Text>
            <Text>
              {formatMessage(
                activeModule ? activeModule.name : rootNavigationItem.name,
              )}
            </Text>
          </Box>
          <Box display="flex" alignItems="center" marginLeft={2}>
            <Button
              colorScheme="negative"
              circle
              size="small"
              icon="chevronDown"
              aria-hidden
            />
          </Box>
        </FocusableBox>
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
    </Box>
  )
}
