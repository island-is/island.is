import React, { useContext } from 'react'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import * as styles from './Header.treat'

const Header: React.FC = () => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

  return (
    <header className={`${styles.header}`}>
      <Link href="#" data-testid="link-to-home">
        <Box display="flex" alignItems="center" cursor="pointer">
          <div className={styles.islandIsApplicationLogoWrapper}>
            <Logo width={146} />
          </div>
          {router.pathname !== '/' && (
            <>
              {/* Text does not allow className prop so we need to do this on a separate span */}
              <span className={styles.headerDiviter} />
              <span className={styles.headerTextWrapper}>
                <Text>Umsókn um fjárhagsaðstoð</Text>
              </span>
            </>
          )}
        </Box>
      </Link>
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
  )
}

export default Header
