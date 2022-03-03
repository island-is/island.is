import React, { FC, useEffect, useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { useLocation } from 'react-router-dom'
import cn from 'classnames'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  ToastContainer,
} from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { useScrollTopOnUpdate } from '@island.is/service-portal/core'

import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import { useModules } from '../../hooks/useModules/useModules'
import useRoutes from '../../hooks/useRoutes/useRoutes'
import { useStore } from '../../store/stateProvider'
import Header from '../Header/Header'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import MobileMenu from '../MobileMenu/MobileMenu'
import Sidebar from '../Sidebar/Sidebar'

import * as styles from './Layout.css'

const Layout: FC = ({ children }) => {
  useRoutes()
  useModules()
  useNamespaces('service.portal')
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const [{ mobileMenuState, sidebarState }] = useStore()

  return (
    <>
      <AuthOverlay />
      <ToastContainer useKeyframeStyles={false} />
      <Header />
      {/* // counter intuitive, the scroll blocks all scrolling aside from the component that is wrapped */}
      <RemoveScroll enabled={mobileMenuState === 'open'}>
        <Hidden above="sm">
          <MobileMenu />
        </Hidden>
      </RemoveScroll>
      <Hidden below="md">
        <Sidebar />
      </Hidden>
      <Box
        overflow="hidden"
        className={cn(
          styles.layoutWrapper,
          sidebarState === 'closed' && styles.layoutWrapperWide,
        )}
        paddingBottom={7}
      >
        <Box as="main">
          <GridContainer>
            <GridRow>
              <GridColumn span={'12/12'} className={styles.layoutGrid}>
                <ContentBreadcrumbs />
                <div>{children}</div>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </>
  )
}
export default Layout
