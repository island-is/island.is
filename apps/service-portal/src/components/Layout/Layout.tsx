import React, { FC, useState } from 'react'
import Header from '../Header/Header'
import { ToastContainer, NavigationItem, Box } from '@island.is/island-ui/core'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import { useLocation } from 'react-router-dom'
import { useNamespaces } from '@island.is/localization'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import { useAlertBanners } from '@island.is/service-portal/graphql'
import { useMeasure } from 'react-use'
import { useDynamicRoutesWithNavigation } from '@island.is/service-portal/core'
import { useActiveModule } from '@island.is/portals/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import FullWidthLayout from './FullWidthLayout'
import { NarrowLayout } from './NarrowLayout'

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  useNamespaces(['service.portal', 'global', 'portals'])
  const activeModule = useActiveModule()
  const { pathname } = useLocation()
  const [sideMenuOpen, setSideMenuOpen] = useState(false)

  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const activeParent = navigation?.children?.find((item) => {
    const currentItemIsActive = item.active
    const hasActiveChild = item.children?.find((child) => child.active)
    return currentItemIsActive || hasActiveChild
  })
  const banners = useAlertBanners()
  const [ref, { height }] = useMeasure()
  const globalBanners = banners.filter((banner) =>
    banner.servicePortalPaths?.includes('*'),
  )
  const isFullwidth = activeModule?.layout === 'full'

  return (
    <div>
      <AuthOverlay />
      <ToastContainer useKeyframeStyles={false} />
      {globalBanners.length > 0 && (
        <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
      )}
      <Header
        setSideMenuOpen={(set: boolean) => setSideMenuOpen(set)}
        sideMenuOpen={sideMenuOpen}
        position={height && globalBanners.length > 0 ? height : 0}
      />

      {!isFullwidth && activeParent && (
        <NarrowLayout
          activeParent={activeParent}
          height={height}
          pathname={pathname}
        >
          {children}
        </NarrowLayout>
      )}
      {(isFullwidth || !activeParent) && (
        <FullWidthLayout
          activeParent={activeParent}
          height={height}
          pathname={pathname}
        >
          {children}
        </FullWidthLayout>
      )}
    </div>
  )
}
