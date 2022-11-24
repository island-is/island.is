import React, { FC } from 'react'
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
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import { useAlertBanners } from '@island.is/service-portal/graphql'
import { useMeasure } from 'react-use'

const Layout: FC = ({ children }) => {
  useRoutes()
  useModules()
  useNamespaces(['service.portal', 'global'])
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const [{ mobileMenuState, sidebarState }] = useStore()
  const banners = useAlertBanners()
  const [ref, { height }] = useMeasure()
  const globalBanners = banners.filter((banner) =>
    banner.servicePortalPaths?.includes('*'),
  )

  return (
    <>
      <AuthOverlay />
      <ToastContainer useKeyframeStyles={false} />
      {globalBanners.length > 0 && (
        <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
      )}
      <Header position={height ? height : 0} />
      {/* // counter intuitive, the scroll blocks all scrolling aside from the component that is wrapped */}
      <Hidden print>
        <RemoveScroll enabled={mobileMenuState === 'open'}>
          <Hidden above="sm">
            <MobileMenu position={height ? height : 0} />
          </Hidden>
        </RemoveScroll>
        <Hidden below="md">
          <Sidebar position={height ? height : 0} />
        </Hidden>
      </Hidden>
      <Box
        className={cn(
          styles.layoutWrapper,
          sidebarState === 'closed' && styles.layoutWrapperWide,
        )}
        paddingBottom={7}
      >
        <Box as="main" component="main" style={{ marginTop: height }}>
          <GridContainer className={styles.layoutContainer}>
            <GridRow>
              <GridColumn
                span={['12/12', '12/12', '12/12', '11/12']}
                className={styles.layoutGrid}
              >
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
