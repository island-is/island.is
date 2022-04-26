import React, { FC, useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import {
  Box,
  Hidden,
  ToastContainer,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.css'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import useRoutes from '../../hooks/useRoutes/useRoutes'
import { useModules } from '../../hooks/useModules/useModules'
import { useScrollTopOnUpdate } from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useNamespaces } from '@island.is/localization'
import { useStore } from '../../store/stateProvider'
import { RemoveScroll } from 'react-remove-scroll'
import cn from 'classnames'

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
      <Hidden print>
        <RemoveScroll enabled={mobileMenuState === 'open'}>
          <Hidden above="sm">
            <MobileMenu />
          </Hidden>
        </RemoveScroll>
        <Hidden below="md">
          <Sidebar />
        </Hidden>
      </Hidden>
      <Box
        overflow="hidden"
        className={cn(
          styles.layoutWrapper,
          sidebarState === 'closed' && styles.layoutWrapperWide,
        )}
        paddingBottom={7}
      >
        <Box as="main" component="main">
          <GridContainer>
            <GridRow>
              <GridColumn span={'12/12'} className={styles.layoutGrid}>
                <Hidden print>
                  <ContentBreadcrumbs />
                </Hidden>
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
