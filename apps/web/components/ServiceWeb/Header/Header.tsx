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
  AsyncSearch,
  ResponsiveSpace,
  Link,
} from '@island.is/island-ui/core'

import * as styles from './Header.treat'

interface HeaderProps {
  logoTitle?: string
  hideSearch?: boolean
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header = ({ logoTitle = '', hideSearch }: HeaderProps) => {
  return (
    <Hidden print={true}>
      <header>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
              <Columns alignY="center" space={2}>
                <Column width="content">
                  <Box display="flex" height="full" alignItems="center">
                    <Box height="full">
                      <Link href="/thjonustuvefur">
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
                      </Link>
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
                    className={styles.headerActions}
                  >
                    {!hideSearch && (
                      <Box marginLeft={marginLeft}>
                        <AsyncSearch
                          size="medium"
                          key="ok"
                          options={[
                            {
                              label:
                                'Hvað tekur langan tíma að fá ökuskírteini?',
                              value:
                                'Hvað tekur langan tíma að fá ökuskírteini?',
                            },
                            {
                              label: 'Hvað er kaupmáli?',
                              value: 'Hvað er kaupmáli?',
                            },
                            {
                              label: 'Er til eyðublað fyrir kaupmála?',
                              value: 'Er til eyðublað fyrir kaupmála?',
                            },
                          ]}
                          placeholder="Leitaðu á þjónustuvefnum"
                        />
                      </Box>
                    )}
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
