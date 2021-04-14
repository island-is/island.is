import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Hidden,
  Button,
  Logo,
  FocusableBox,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import UserMenuTrigger from '../UserMenuTrigger/UserMenuTrigger'
import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { Paths } from '../../constants'

import * as styles from './Header.treat'

export const Header: FC<{}> = () => {
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
          <GridContainer>
            <GridRow>
              <GridColumn span={'12/12'}>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  height="full"
                  background="white"
                >
                  <Link to={Paths.Root}>
                    <FocusableBox component="div">
                      <Hidden above="md">
                        <Logo width={40} iconOnly />
                      </Hidden>
                      <Hidden below="lg">
                        <Logo width={160} />
                      </Hidden>
                    </FocusableBox>
                  </Link>
                  <Box display="flex" alignItems="center" flexWrap="nowrap">
                    <Hidden below="lg">
                      <UserMenuTrigger />
                    </Hidden>
                    <Hidden above="md">
                      <Box marginLeft={[1, 1, 1, 2]}>
                        <Button
                          variant="utility"
                          icon={mobileMenuState === 'open' ? 'close' : 'menu'}
                          onClick={handleMobileMenuTriggerClick}
                        >
                          Valmynd
                        </Button>
                      </Box>
                    </Hidden>
                  </Box>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </header>
    </>
  )
}

export default Header
