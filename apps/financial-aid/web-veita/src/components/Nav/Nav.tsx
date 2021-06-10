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

import { api } from '../../services'
import { AdminContext } from '../AdminProvider/AdminProvider'

import { navLinks } from '../../utils/formHelper'

const Nav: React.FC = () => {
  const router = useRouter()

  const { isAuthenticated, setAdmin, admin } = useContext(AdminContext)

  const otherItems = [
    {
      label: 'Útskráning',
      icon: 'logOut',
      onclick: () => {
        api.logOut()
        setAdmin && setAdmin(undefined)
      },
    },
  ]

  return (
    <nav className={styles.container}>
      <header>
        <div className={`${styles.logoContainer} logoContainer`}>
          <Logo />
        </div>
        <div className={styles.logoHfjContainer}>
          <Box className={`logoHfj`}>
            <LogoHfj />
          </Box>

          <Box paddingLeft={2} className={'headLine'}>
            <Text as="h1" lineHeight="sm">
              <strong>Sveita</strong> • Umsóknir um fjárhagsaðstoð
            </Text>
          </Box>
        </div>
      </header>

      <div>
        {navLinks().map((item, index) => {
          return (
            <Link href={item.link} key={'NavigationLinks-' + index}>
              <a
                aria-label={item.label}
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
                onClick={item.onclick}
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
