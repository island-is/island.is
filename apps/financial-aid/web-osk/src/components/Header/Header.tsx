import React, { useContext } from 'react'
import {
  Logo,
  Text,
  Box,
  Button,
  GridContainer,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import * as styles from './Header.treat'

const Header: React.FC = () => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

  return (
    <GridContainer>
      <header className={`${styles.header}`}>
        <Box display="flex" height="full" alignItems="center">
          <Link href="/" data-testid="link-to-home">
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
          </Link>

          <Box
            display="flex"
            height="full"
            flexDirection="column"
            justifyContent="center"
            className={styles.headerTextWrapper}
            paddingLeft={[2, 2, 4]}
          >
            <Text fontWeight="semiBold" variant="small">
              Hafnarfjörður
            </Text>

            <span className={styles.desktopText}>
              <Text>Umsókn um fjárhagsaðstoð</Text>
            </span>

            <span className={styles.mobileText}>
              <Text>Fjárhagsaðstoð</Text>
            </span>
          </Box>
        </Box>

        <Box className={styles.userButton}>
          <Button
            icon="chevronDown"
            iconType="filled"
            onClick={() => {
              console.log('hel')
              // api.logOut()
              // setUser && setUser(undefined)
            }}
            data-testid="logout-button"
            preTextIconType="filled"
            size="small"
            type="button"
            variant="utility"
          >
            <img src="/placeholder.jpg" className={styles.userProfileImage} />
            Nafn Nafndóttir
          </Button>
        </Box>

        {/* {isAuthenticated && (
        <Button
          variant="ghost"
          icon="logOut"
          iconType="outline"
          size="small"
          onClick={() => {
            api.logOut()
            setUser && setUser(undefined)
          }}
          data-testid="logout-button"
        >
          {user?.name}
        </Button>
      )} */}
      </header>
    </GridContainer>
  )
}

export default Header
