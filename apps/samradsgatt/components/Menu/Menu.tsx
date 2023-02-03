import {
  Box,
  Logo,
  Button,
  Inline,
  GridColumn,
  GridRow,
  Divider,
  GridContainer,
  Columns,
  Column,
  ResponsiveSpace,
  Hidden,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import * as styles from './Menu.css'
import React from 'react'
import { MenuLogo } from '../svg'
import { menuItems } from './MenuItems'
type MenuProps = {
  showIcon: boolean
}
export const Menu = ({ showIcon = true }: MenuProps) => {
  const router = useRouter()
  const marginLeft = [1, 1, 1, 2] as ResponsiveSpace
  const biggerMarginLeft = [3, 3, 3, 4] as ResponsiveSpace

  return (
    <header className={styles.menu}>
      <Hidden print={true}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingBottom={3} paddingTop={3}>
              <Columns alignY="center" space={2}>
                <Column width="content">
                  <Box>
                    <Logo iconOnly width={26} />
                  </Box>
                </Column>
                <Column width="content">
                  <Box>
                    <Box
                      style={{
                        transform: 'rotate(90deg)',
                        width: 56,
                      }}
                      marginX={1}
                    >
                      <Divider />
                    </Box>
                  </Box>
                </Column>

                <Column width="content">
                  <Hidden screen={!showIcon}>
                    <Box onClick={() => router.push('/')}>
                      <MenuLogo />
                    </Box>
                  </Hidden>
                </Column>

                <Column>
                  <Hidden below="lg">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flexEnd"
                      width="full"
                    >
                      {menuItems.map((item, index) => {
                        return (
                          <Box marginLeft={marginLeft} key={index}>
                            <Button
                              variant="utility"
                              size="medium"
                              onClick={() => router.push(item.href)}
                            >
                              {item.label}
                            </Button>
                          </Box>
                        )
                      })}
                      <Box marginLeft={biggerMarginLeft}>
                        <Button size="small">Innskráning</Button>
                      </Box>
                    </Box>
                  </Hidden>
                </Column>
              </Columns>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Hidden>
    </header>
  )
}
export default Menu
