import { ToastContainer } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { useActiveModule } from '@island.is/portals/core'
import {
  SearchPaths,
  ServicePortalPaths,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import { useAlertBanners } from '@island.is/portals/my-pages/graphql'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import React, { FC, useEffect, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { useMeasure } from 'react-use'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import Header from '../Header/Header'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import FullWidthLayout from './FullWidthLayout'
import { NarrowLayout } from './NarrowLayout'
import { HeaderVisibilityContext } from '../../context/HeaderVisibilityContext'

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
  const [headerVisible, setHeaderVisible] = useState<boolean>(true)

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
    <HeaderVisibilityContext.Provider
      value={{ headerVisible, setHeaderVisible }}
    >
      <div>
        <AuthOverlay />
        <ToastContainer useKeyframeStyles={false} />
        {globalBanners.length > 0 && (
          <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
        )}
        <Header
          position={height && globalBanners.length > 0 ? height : 0}
          includeSearchInHeader={!disableSearch && showSearch}
          onHeaderVisibilityChange={setHeaderVisible}
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
    </HeaderVisibilityContext.Provider>
  )
}
