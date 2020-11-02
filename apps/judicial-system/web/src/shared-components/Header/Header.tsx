import React, { useContext, useEffect } from 'react'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'

import { userContext } from '../../utils/userContext'
import { api } from '../../services'
import * as styles from './Header.treat'
import * as Constants from '../../utils/constants'
import { IslandIsApplicationLogo } from '../Logos'
import { gql, useQuery } from '@apollo/client'

export const UserQuery = gql`
  query UserQuery {
    user {
      name
      title
      role
    }
  }
`

const User: React.FC = () => {
  const { setUser } = useContext(userContext)

  const { loading, data } = useQuery(UserQuery, { fetchPolicy: 'no-cache' })
  const user = data?.user

  useEffect(() => {
    if (loading) {
      return
    }

    setUser(user)
  }, [loading, user, setUser])

  return (
    <Button
      variant="ghost"
      icon="logOut"
      iconType="outline"
      size="small"
      onClick={() => {
        setUser(null)
        api.logOut()
      }}
      data-testid="logout-button"
    >
      {user?.name}
    </Button>
  )
}

interface Props {
  pathname: string
}

const Header: React.FC<Props> = (props: Props) => {
  const { isAuthenticated } = useContext(userContext)

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
      {isAuthenticated() && <User />}
    </header>
  )
}

export default Header
