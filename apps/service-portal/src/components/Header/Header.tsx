import React, { FC } from 'react'
import {
  Box,
  Hidden,
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
import { Link } from 'react-router-dom'

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
        <Box width="full">
          <Box
            display="flex"
            justifyContent={[
              'spaceBetween',
              'spaceBetween',
              'spaceBetween',
              'flexEnd',
              'flexEnd',
            ]}
            alignItems="center"
            width="full"
            background="white"
            paddingX={[3, 3, 3, 3, 6]}
          >
            <Hidden above="md">
              <Link to={ServicePortalPath.MinarSidurRoot}>
                <FocusableBox component="div">
                  <Logo width={40} iconOnly />
                  <BetaTag />
                </FocusableBox>
              </Link>
            </Hidden>
            <Box display="flex" alignItems="center" flexWrap="nowrap">
              <UserMenu fullscreen />
              <Hidden above="md">
                <Box marginLeft={[1, 2]}>
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
        </Box>
      </header>
    </>
  )
}

export default Header
