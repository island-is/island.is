import React from 'react'
import {
  Box,
  Hidden,
  Logo,
  FocusableBox,
  Inline,
  Text,
  GridContainer,
} from '@island.is/island-ui/core'
import { UserMenu } from '@island.is/shared/components'
import { Link } from 'react-router-dom'

import * as styles from './Header.css'

export const Header = () => {
  return (
    <div className={styles.placeholder}>
      <header className={styles.header}>
        <GridContainer>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            width="full"
            background="white"
          >
            <Inline alignY="center">
              <Link to={'/'}>
                <FocusableBox component="div">
                  <Hidden above="md">
                    <Logo width={40} iconOnly />
                  </Hidden>
                  <Hidden below="lg">
                    <Logo width={160} />
                  </Hidden>
                </FocusableBox>
              </Link>
              <Box
                display="flex"
                className={styles.infoContainer}
                alignItems="center"
                height="full"
                marginLeft={[1, 1, 2, 4]}
                marginRight="auto"
              >
                <Box marginLeft={[1, 1, 2, 4]}>
                  <Text variant="eyebrow">Stjórnborð</Text>
                  <Text>Yfirlit</Text>
                </Box>
              </Box>
            </Inline>
            <Hidden print>
              <Box
                display="flex"
                alignItems="center"
                flexWrap="nowrap"
                marginLeft={1}
              >
                <UserMenu fullscreen />
              </Box>
            </Hidden>
          </Box>
        </GridContainer>
      </header>
    </div>
  )
}

export default Header
