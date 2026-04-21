import { ToastContainer } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { useActiveModule } from '@island.is/portals/core'
import {
  SearchPaths,
  ServicePortalPaths,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import { DELEGATION_BANNER_HEIGHT } from '@island.is/portals/my-pages/constants'
import { useAlertBanners } from '@island.is/portals/my-pages/graphql'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useUserInfo } from '@island.is/react-spa/bff'
import { checkDelegation } from '@island.is/shared/utils'
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
  const user = useUserInfo()
  const isDelegation = checkDelegation(user)

  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const activeParent = navigation?.children
    //filter out custom shortcuts
    ?.filter((item) => !item.customShortcut)
    .find((item) => {
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

  const alertBannerHeight = height && globalBanners.length > 0 ? height : 0
  const delegationBannerHeight = isDelegation ? DELEGATION_BANNER_HEIGHT : 0
  const totalBannerOffset = alertBannerHeight + delegationBannerHeight

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
          position={alertBannerHeight}
          includeSearchInHeader={!disableSearch && showSearch}
          onHeaderVisibilityChange={setHeaderVisible}
        />

        {!isFullwidth && activeParent && (
          <NarrowLayout
            activeParent={activeParent}
            height={totalBannerOffset}
            pathname={pathname}
          >
            {children}
          </NarrowLayout>
        )}
        {(isFullwidth || !activeParent) && (
          <FullWidthLayout
            activeParent={activeParent}
            height={totalBannerOffset}
            pathname={pathname}
          >
            {children}
          </FullWidthLayout>
        )}
      </div>
    </HeaderVisibilityContext.Provider>
  )
}
