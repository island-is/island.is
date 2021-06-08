/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Box,
  Column,
  Columns,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Logo,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './Header.treat'

interface HeaderProps {
  logoTitle?: string
}

export const Header = ({ logoTitle = '' }: HeaderProps) => {
  return (
    <Hidden print={true}>
      <header className={styles.header}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
              <Columns alignY="center" space={2}>
                <Column width="content">
                  <Box display="flex" height="full" alignItems="center">
                    <Box height="full">
                      <Hidden above="md">
                        <Logo
                          id="helpdesk-logo-1"
                          width={40}
                          iconOnly
                          solid={true}
                        />
                      </Hidden>
                      <Hidden below="lg">
                        <Logo id="header-logo-2" width={160} solid={true} />
                      </Hidden>
                    </Box>
                    {logoTitle && (
                      <Hidden below="lg">
                        <div className={styles.logoTitleContainer}>
                          <Text as="span" variant="h4" color="white">
                            {logoTitle}
                          </Text>
                        </div>
                      </Hidden>
                    )}
                  </Box>
                </Column>
                <Column>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flexEnd"
                    width="full"
                  >
                    {/* stuff comes here (maybe) */}
                  </Box>
                </Column>
              </Columns>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </header>
    </Hidden>
  )
}

export default Header
