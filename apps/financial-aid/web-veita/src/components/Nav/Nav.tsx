import React, { useContext } from 'react'
import {
  Logo,
  Text,
  Box,
  Button,
  GridContainer,
  ButtonProps,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import * as styles from './Nav.treat'

const Nav: React.FC = () => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

  const otherItems = [
    {
      label: 'Leit',
      icon: 'search',
    },
    {
      label: 'Tölfræði',
      icon: 'cellular',
    },
    {
      label: 'Stillingar',
      icon: 'settings',
    },
    {
      label: 'Útskráning',
      icon: 'logOut',
    },
  ]

  return (
    <nav className={styles.container}>
      <header>
        <div className={styles.logoContainer}>
          <Logo />
        </div>
        <div className={styles.logoHfjContainer}>
          <div className={styles.logoHfj}></div>
          <Text as="h1">
            <strong>Sveita</strong> • Umsóknir um fjárhagsaðstoð
          </Text>
        </div>
      </header>

      <div>nav here</div>

      {/* <div className={`wrapper `}>navigation</div> */}

      <div className={styles.otherItems}>
        {otherItems.map((item, index) => {
          return (
            <Box display="block" marginBottom={2} key={index}>
              <Button
                colorScheme="default"
                iconType="outline"
                onClick={function noRefCheck() {}}
                preTextIcon={item.icon as ButtonProps['icon']}
                preTextIconType="outline"
                size="default"
                type="button"
                variant="text"
              >
                {item.label}
              </Button>
            </Box>
          )
        })}
      </div>
    </nav>
  )
}

export default Nav
