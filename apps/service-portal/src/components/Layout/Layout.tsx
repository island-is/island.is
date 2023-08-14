import React, { FC, useState } from 'react'
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
import {
  ModuleAlertBannerSection,
  useScrollTopOnUpdate,
} from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useNamespaces } from '@island.is/localization'
import { RemoveScroll } from 'react-remove-scroll'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import { useAlertBanners } from '@island.is/service-portal/graphql'
import { useMeasure } from 'react-use'

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  useNamespaces(['service.portal', 'global', 'portals'])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
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
      <Header
        setMobileMenuOpen={(set: boolean) => setMobileMenuOpen(set)}
        mobileMenuOpen={mobileMenuOpen}
        position={height ? height : 0}
      />
      {/* // counter intuitive, the scroll blocks all scrolling aside from the component that is wrapped */}
      <Hidden print>
        <RemoveScroll enabled={mobileMenuOpen}>
          <Hidden above="sm">
            <MobileMenu
              position={height ? height : 0}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={() => setMobileMenuOpen(false)}
            />
          </Hidden>
        </RemoveScroll>
        <Hidden below="md">
          <Sidebar position={height ? height : 0} />
        </Hidden>
      </Hidden>
      <Box className={styles.layoutWrapper} paddingBottom={7}>
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
                <ModuleAlertBannerSection />
                {children}
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </>
  )
}
