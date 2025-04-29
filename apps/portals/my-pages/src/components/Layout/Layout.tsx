import React, { FC, useEffect, useState } from 'react'
import Header from '../Header/Header'
import { ToastContainer } from '@island.is/island-ui/core'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import { matchPath, useLocation } from 'react-router-dom'
import { useNamespaces } from '@island.is/localization'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import { useAlertBanners } from '@island.is/portals/my-pages/graphql'
import { useMeasure } from 'react-use'
import {
  SearchPaths,
  ServicePortalPaths,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import { useActiveModule } from '@island.is/portals/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import FullWidthLayout from './FullWidthLayout'
import { NarrowLayout } from './NarrowLayout'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  useNamespaces(['service.portal', 'global', 'portals', 'sp.search.tags'])
  const activeModule = useActiveModule()
  const { pathname } = useLocation()

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

  const [showSearch, setShowSearch] = useState<boolean>(false)

  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        'isMyPagesSearchEnabled',
        false,
      )
      if (ffEnabled) {
        setShowSearch(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const disableSearch = [
    ...Object.values(ServicePortalPaths),
    ...Object.values(SearchPaths),
  ].find((route) => matchPath(route, pathname))

  return (
    <div>
      <AuthOverlay />
      <ToastContainer useKeyframeStyles={false} />
      {globalBanners.length > 0 && (
        <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
      )}
      <Header
        position={height && globalBanners.length > 0 ? height : 0}
        includeSearchInHeader={!disableSearch && showSearch}
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
