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
      link: '/',
    },
    {
      label: 'Í vinnslu',
      link: '/vinnslu',
    },
    {
      label: 'Afgreidd mál',
      link: '/afgreidd',
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
            <Link href={item.link} key={'NavigationLinks-' + index}>
              <a
                className={cn({
                  [`${styles.link}`]: true,
                  [`${styles.activeLink}`]: router.pathname === item.link,
                })}
              >
                <Text fontWeight="semiBold">{item.label}</Text>
              </a>
            </Link>
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
