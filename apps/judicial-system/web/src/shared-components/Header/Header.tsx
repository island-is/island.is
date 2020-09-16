import React from 'react'
import { Logo, Typography, Box, Button } from '@island.is/island-ui/core'
import * as api from '../../api'

import * as styles from './Header.treat'

export interface HeaderProps {
  loggedInUser?: string
}

const Header: React.FC<HeaderProps> = ({ loggedInUser }: HeaderProps) => {
  return (
    <header className={`${styles.header}`}>
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
        </Box>
      )}
      <Button variant="text" size="small" onClick={() => api.logOut()}>
        Útskráning
      </Button>
    </header>
  )
}

export default Header
