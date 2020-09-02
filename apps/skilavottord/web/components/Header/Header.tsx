/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Logo,
  Columns,
  Column,
  Box,
  Button,
  Hidden,
  ResponsiveSpace,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { LanguageToggler } from '../LanguageToggler'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'

interface HeaderProps {
  showSearchInHeader?: boolean
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<HeaderProps> = ({ showSearchInHeader = true }) => {
  const Router = useRouter()
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale)

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
          <Columns alignY="center" space={2}>
            <Column width="content">
              <Link href={activeLocale === 'is' ? './' : './en'} passHref>
                <a>
                  <Hidden above="md">
                    <Logo width={40} iconOnly />
                  </Hidden>
                  <Hidden below="lg">
                    <Logo width={160} />
                  </Hidden>
                </a>
              </Link>
            </Column>
            <Column>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flexEnd"
                width="full"
              >
                <Box marginLeft={marginLeft}>
                  <Button
                    variant="menu"
                    leftIcon="user"
                    onClick={() => {
                      Router.push({
                        pathname: makePath('myPage'),
                        query: { focus: true },
                      })
                    }}
                  >
                    Login
                  </Button>
                </Box>
                <Box marginLeft={marginLeft}>
                  <LanguageToggler hideWhenMobile />
                </Box>
              </Box>
            </Column>
          </Columns>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Header
