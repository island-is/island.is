import React, { useContext } from 'react'
import {
  Logo,
  Text,
  Box,
  GridContainer,
  DropdownMenu,
  LinkV2,
} from '@island.is/island-ui/core'

import * as styles from './Header.css'

import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/hooks/useLogOut'
import { Routes } from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const Header = () => {
  const { isAuthenticated, user, municipality } = useContext(AppContext)

  const logOut = useLogOut()

  return (
    <GridContainer>
      <header className={`${styles.header}`}>
        <Box display="flex" height="full" alignItems="center">
          <LinkV2
            href={
              user?.currentApplicationId
                ? Routes.statusPage(user?.currentApplicationId as string)
                : Routes.application
            }
            data-testid="link-to-home"
            legacyBehavior
          >
            <Box
              display="flex"
              alignItems="center"
              cursor="pointer"
              marginRight={[0, 0, 4]}
            >
              <div className={styles.islandIsApplicationLogoWrapper}>
                <Logo width={146} />
              </div>

              <div className={styles.islandIsApplicationLogoIconWrapper}>
                <Logo width={40} iconOnly />
              </div>
            </Box>
          </LinkV2>

          <Box
            height="full"
            flexDirection="column"
            justifyContent="center"
            className={styles.headerTextWrapper}
            paddingLeft={[2, 2, 4]}
          >
            <Text fontWeight="semiBold" variant="small">
              {municipality?.name ?? 'Samband íslenskra sveitarfélaga'}
            </Text>

            <span className={styles.desktopText}>
              <Text>Umsókn um fjárhagsaðstoð</Text>
            </span>

            <span className={styles.mobileText}>
              <Text>Fjárhagsaðstoð</Text>
            </span>
          </Box>
        </Box>

        <Box className={styles.dropdownMenuWrapper}>
          {isAuthenticated && (
            <DropdownMenu
              icon="chevronDown"
              items={[
                {
                  href: 'https://island.is/innskraning',
                  title: 'Mínar síður',
                },
                {
                  onClick: () => {
                    logOut()
                  },
                  title: 'Útskráning',
                },
              ]}
              title={user?.name}
            />
          )}
        </Box>
      </header>
    </GridContainer>
  )
}

export default Header
