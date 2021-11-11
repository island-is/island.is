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

import {
  AdminSideNavItems,
  EmployeeSideNavItems,
  LoadingContainer,
  LogoMunicipality,
  SuperAdminSideNavItems,
} from '@island.is/financial-aid-web/veita/src/components'

import * as styles from './Nav.css'
import * as sideNavButtonStyles from '../../sharedStyles/SideNavButton.css'

import cn from 'classnames'
import { ApplicationFiltersContext } from '@island.is/financial-aid-web/veita/src/components/ApplicationFiltersProvider/ApplicationFiltersProvider'

import { useLogOut } from '@island.is/financial-aid-web/veita/src/utils/useLogOut'

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
        [`${styles.adminStyles}`]: admin,
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
            {admin ? (
              <Text as="h1" lineHeight="sm">
                <strong>Mamma Sveitó</strong> • Umsjón með sveitarfélögum
              </Text>
            ) : (
              <Text as="h1" lineHeight="sm">
                <strong>Veita</strong> • Umsóknir um fjárhagsaðstoð
              </Text>
            )}
          </Box>
        </div>
      </header>

      <div>
        <LoadingContainer
          isLoading={loading}
          loader={<SkeletonLoader repeat={3} space={2} />}
        >
          <EmployeeSideNavItems
            roles={admin?.staff?.roles}
            applicationFilters={applicationFilters}
          />
        </LoadingContainer>
      </div>

      <Box display="block" marginBottom={2} marginTop={4}>
        <Box marginBottom={2}>
          <SuperAdminSideNavItems roles={admin?.staff?.roles} />
          <AdminSideNavItems roles={admin?.staff?.roles} />
          <button
            className={`${sideNavButtonStyles.sideNavBarButton} navBarButtonHover`}
            onClick={() => logOut()}
          >
            <Icon
              icon="logOut"
              type="outline"
              color="blue400"
              className={sideNavButtonStyles.sideNavBarButtonIcon}
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
