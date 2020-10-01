import React, { useContext } from 'react'
import { Logo, Typography, Box, Button } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'

import { userContext } from '../../utils/userContext'
import * as api from '../../api'
import * as styles from './Header.treat'
import * as Constants from '../../utils/constants'

const Header: React.FC = () => {
  const uContext = useContext(userContext)

  return (
    <header className={`${styles.header}`}>
      <Link
        to={Constants.DETENTION_REQUESTS_ROUTE}
        style={{ textDecoration: 'none' }}
        data-testid="link-to-home"
      >
        <Box display="flex" alignItems="center">
          <Logo width={32} iconOnly />
          <Box marginLeft={[1, 2, 4]}>
            <Typography as="h1" variant="h4">
              Réttarvörslugátt
            </Typography>
          </Box>
        </Box>
      </Link>
      {uContext.user && (
        <Button variant="text" size="small" onClick={() => api.logOut()}>
          Útskráning
        </Button>
      )}
    </header>
  )
}

export default Header
