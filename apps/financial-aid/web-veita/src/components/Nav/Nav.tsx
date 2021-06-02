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

import { LogoHfj } from '../'

import * as styles from './Nav.treat'
import cn from 'classnames'

const Nav: React.FC = () => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

  const otherItems = [
    // {
    //   label: 'Leit',
    //   icon: 'search',
    // },
    // {
    //   label: 'Tölfræði',
    //   icon: 'cellular',
    // },
    // {
    //   label: 'Stillingar',
    //   icon: 'settings',
    // },
    {
      label: 'Útskráning',
      icon: 'logOut',
    },
  ]

  const navLinks = [
    {
      label: 'Ný mál',
    },
    {
      label: 'Í vinnslu',
    },
    {
      label: 'Afgreidd mál',
    },
  ]

  return (
    <nav className={styles.container}>
      <header>
        <div className={styles.logoContainer}>
          <Logo />
        </div>
        <div className={styles.logoHfjContainer}>
          <LogoHfj className={styles.logoHfj} />

          <Box paddingLeft={2} className={styles.headline}>
            <Text as="h1" lineHeight="sm">
              <strong>Sveita</strong> • Umsóknir um fjárhagsaðstoð
            </Text>
          </Box>
        </div>
      </header>

      <div>
        {navLinks.map((item, index) => {
          return (
            <Box
              display="block"
              marginBottom={1}
              key={'nav link' + index}
              className={cn({
                [`${styles.activeLink}`]: index === 0,
              })}
            >
              <Button
                colorScheme="default"
                iconType="filled"
                onBlur={function noRefCheck() {}}
                onClick={function noRefCheck() {}}
                onFocus={function noRefCheck() {}}
                preTextIconType="filled"
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
