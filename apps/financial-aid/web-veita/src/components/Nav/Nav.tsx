import React, { useContext } from 'react'
import {
  Logo,
  Text,
  Box,
  Divider,
  Icon,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import {
  LoadingContainer,
  LogoMunicipality,
} from '@island.is/financial-aid-web/veita/src/components'

import * as styles from './Nav.css'
import cn from 'classnames'
import { ApplicationFiltersContext } from '@island.is/financial-aid-web/veita/src/components/ApplicationFiltersProvider/ApplicationFiltersProvider'

import { useLogOut } from '@island.is/financial-aid-web/veita/src/utils/useLogOut'
import {
  ApplicationFiltersEnum,
  Routes,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

interface Props {
  showInMobile: boolean
}

const Nav = ({ showInMobile }: Props) => {
  const router = useRouter()

  const logOut = useLogOut()

  const { applicationFilters, loading } = useContext(ApplicationFiltersContext)

  const { admin } = useContext(AdminContext)

  return (
    <nav
      className={cn({
        [`${styles.container}`]: true,
        [`${styles.showNavInMobile}`]: showInMobile,
      })}
    >
      <header>
        <div className={styles.logoContainer}>
          <Logo />
        </div>
        <div className={styles.logoMunicipalityContainer}>
          <Box className={styles.logoMunicipality}>
            <LogoMunicipality />
          </Box>

          <Box paddingLeft={2} className={'headLine'}>
            <Text as="h1" lineHeight="sm">
              <strong>Veita</strong> • Umsóknir um fjárhagsaðstoð
            </Text>
          </Box>
        </div>
      </header>

      <div>
        <LoadingContainer
          isLoading={loading}
          loader={<SkeletonLoader repeat={3} space={2} />}
        >
          {admin?.staff?.roles.includes(StaffRole.EMPLOYEE) &&
            navigationItems.map((item, index) => {
              return (
                <div key={'NavigationLinks-' + index}>
                  {item.group && <p className={styles.group}>{item.group}</p>}
                  <Link href={item.link}>
                    <a
                      aria-label={item.label}
                      className={cn({
                        [`${styles.link}`]: true,
                        [`${styles.activeLink}`]: router.pathname === item.link,
                        [`${styles.linkHoverEffect}`]:
                          router.pathname !== item.link,
                      })}
                    >
                      <Box display="flex" justifyContent="spaceBetween">
                        <Text fontWeight="semiBold">{item.label}</Text>
                        <Text fontWeight="semiBold" color="dark300">
                          {item.applicationState
                            .map((state: ApplicationFiltersEnum) => {
                              if (applicationFilters) {
                                return applicationFilters[state]
                              }
                            })
                            .reduce((a?: number, b?: number) => {
                              return (a || 0) + (b || 0)
                            })}
                        </Text>
                      </Box>
                    </a>
                  </Link>
                </div>
              )
            })}
        </LoadingContainer>
      </div>

      <Box display="block" marginBottom={2} marginTop={4}>
        <Box marginBottom={2}>
          {admin?.staff?.roles.includes(StaffRole.ADMIN) && (
            <button
              className={`${styles.sideNavBarButton} navBarButtonHover`}
              onClick={() => router.push(Routes.users)}
            >
              <Icon
                icon="people"
                type="outline"
                color="blue400"
                className={styles.sideNavBarButtonIcon}
              />
              <Text> Notendur</Text>
            </button>
          )}
          <button
            className={`${styles.sideNavBarButton} navBarButtonHover`}
            onClick={() => logOut()}
          >
            <Icon
              icon="logOut"
              type="outline"
              color="blue400"
              className={styles.sideNavBarButtonIcon}
            />
            <Text> Útskráning</Text>
          </button>
        </Box>
        <Divider weight="purple200" />
        {admin && (
          <>
            <Box display="flex" alignItems="center" paddingTop={3}>
              <Icon
                icon="person"
                color="purple400"
                size="small"
                className={styles.personIcon}
              />
              <Text variant="small">{admin?.name}</Text>
            </Box>
          </>
        )}
      </Box>
    </nav>
  )
}

export default Nav
