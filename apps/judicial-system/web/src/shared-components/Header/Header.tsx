import React, { useContext } from 'react'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'

import { api } from '../../services'
import * as styles from './Header.treat'
import * as Constants from '../../utils/constants'
import { UserContext } from '../UserProvider/UserProvider'
import { IslandIsApplicationLogo } from '../Logos'

interface Props {
  pathname: string
}

const Header: React.FC<Props> = (props: Props) => {
  const { isAuthenticated, setUser, user } = useContext(UserContext)

  return (
    <header className={`${styles.header}`}>
      <Link
        to={Constants.DETENTION_REQUESTS_ROUTE}
        style={{ textDecoration: 'none' }}
        data-testid="link-to-home"
      >
        {!props.pathname ||
        props.pathname === '/' ||
        props.pathname === Constants.DETENTION_REQUESTS_ROUTE ? (
          <Logo width={146} />
        ) : (
          <Box display="flex">
            <div className={styles.islandIsApplicationLogoWrapper}>
              <IslandIsApplicationLogo />
            </div>
            {/* Text does not allow className prop so we need to do this on a separate span */}
            <span className={styles.headerDiviter} />
            <span className={styles.headerTextWrapper}>
              <Text>Gæsluvarðhald</Text>
            </span>
          </Box>
        )}
      </Link>
      {isAuthenticated && (
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
      )}
    </header>
  )
}

export default Header
