import React from 'react'
import { Link } from 'react-router-dom'

import {
  Box,
  Hidden,
  Logo,
  FocusableBox,
  Inline,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { UserMenu } from '@island.is/shared/components'

import { ModuleSwitcher } from '../ModuleSwitcher/ModuleSwitcher'

import * as styles from './Header.css'

export const Header = () => {
  return (
    <div className={styles.placeholder}>
      <header className={styles.header}>
        <GridContainer>
          <GridRow>
            <GridColumn span="2/12">
              <Link to={'/'}>
                <FocusableBox component="div">
                  <Hidden above="md">
                    <Logo width={40} iconOnly />
                  </Hidden>
                  <Hidden below="lg">
                    <Logo width={160} />
                  </Hidden>
                </FocusableBox>
              </Link>
            </GridColumn>
            <GridColumn span={['6/12', '6/12', '3/12']}>
              <ModuleSwitcher />
            </GridColumn>
            <GridColumn span={['4/12', '4/12', '7/12']}>
              <Box
                display="flex"
                alignItems="flexEnd"
                flexDirection="column"
                width="full"
              >
                <Hidden print>
                  <Box
                    display="flex"
                    alignItems="center"
                    flexWrap="nowrap"
                    marginLeft={1}
                  >
                    <UserMenu fullscreen />
                  </Box>
                </Hidden>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </header>
    </div>
  )
}

export default Header
