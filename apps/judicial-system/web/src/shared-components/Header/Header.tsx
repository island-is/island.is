import React, { useContext } from 'react'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'

import { userContext } from '../../utils/userContext'
import * as api from '../../api'
import * as styles from './Header.treat'
import * as Constants from '../../utils/constants'
import { IslandIsApplicationLogo } from '../Logos'

interface Props {
  pathname: string
}

const Header: React.FC<Props> = (props: Props) => {
  const uContext = useContext(userContext)

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
      {uContext?.user && (
        <Button
          variant="ghost"
          icon="logOut"
          iconType="outline"
          size="small"
          onClick={() => api.logOut()}
        >
          {uContext.user.name}
        </Button>
      )}
    </header>
  )
}

export default Header
