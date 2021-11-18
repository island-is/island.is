import React, { FC } from 'react'
import {
  Box,
  Hidden,
  ContentBlock,
  Button,
  Logo,
  FocusableBox,
} from '@island.is/island-ui/core'
import * as styles from './Header.css'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { UserMenu } from '@island.is/shared/components'
import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { BetaTag } from '../Logo/BetaTag'
import { m } from '@island.is/service-portal/core'

export const Header: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const [{ mobileMenuState }, dispatch] = useStore()

  const handleMobileMenuTriggerClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: mobileMenuState === 'open' ? 'closed' : 'open',
    })

  return (
    <>
      <div className={styles.placeholder} />
      <header className={styles.header}>
        <Box>
          <ContentBlock>
            <Box height="full" background="white" paddingX={[2, 2, 4, 4, 6]}>
              <Box className={styles.menuBox}>
                <UserMenu />
                <Hidden above="md">
                  <Box marginLeft={2}>
                    <Button
                      variant="utility"
                      icon={mobileMenuState === 'open' ? 'close' : 'menu'}
                      onClick={handleMobileMenuTriggerClick}
                    >
                      {formatMessage(m.menu)}
                    </Button>
                  </Box>
                </Hidden>
              </Box>
            </Box>
          </ContentBlock>
        </Box>
      </header>
    </>
  )
}

export default Header
