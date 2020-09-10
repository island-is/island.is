import React from 'react'
import { Logo, Typography, Box, Button } from '@island.is/island-ui/core'

import * as styles from './Header.treat'
import AuthContext from '../../utils/authContext'

export interface HeaderProps {
  loggedInUser?: string
}

const Header: React.FC<HeaderProps> = ({ loggedInUser }: HeaderProps) => {
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <header className={`${styles.header}`}>
          <p>{auth.accessToken}</p>
          <Box display="flex" alignItems="center">
            <Logo width={32} iconOnly />
            <Box marginLeft={[1, 2, 4]}>
              <Typography as="h1" variant="h4">
                Réttarvörslugátt
              </Typography>
            </Box>
          </Box>
          {loggedInUser && (
            <Box display="flex" alignItems="center">
              <Box marginRight={[1, 2, 4]}>
                <Typography as="p" variant="h5">
                  {loggedInUser}
                </Typography>
              </Box>
              <Button variant="text" size="small">
                Útskráning
              </Button>
            </Box>
          )}
        </header>
      )}
    </AuthContext.Consumer>
  )
}

export default Header
