import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  PlausiblePageviewDetail,
  ServicePortalPaths,
  m,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from '@island.is/portals/my-pages/documents'
import { useUserInfo } from '@island.is/react-spa/bff'
import { isCompany } from '@island.is/shared/utils'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { MAIN_NAVIGATION } from '../../../lib/masterNavigation'
import Greeting from '../../../components/Greeting/Greeting'
import { DashboardFeatured } from './DashboardFeatured'
import { DashboardModules } from './DashboardModules'
import { DashboardNotifications } from './DashboardNotifications'

const useDashboardNav = () => {
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const children = navigation?.children ?? []

  const featured = children
    .filter((item) => item.featured || item.customShortcut?.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))

  const rest = children.filter(
    (item) =>
      !item.featured &&
      !item.customShortcut?.featured &&
      (!item.navHide || item.customShortcut) &&
      item.path !== ServicePortalPaths.Root &&
      item.path !== DocumentsPaths.ElectronicDocumentsRoot,
  )

  return { featured, rest }
}

export const DashboardV2 = () => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const location = useLocation()
  const userInfo = useUserInfo()
  const isMobile = width < theme.breakpoints.md
  const { featured, rest } = useDashboardNav()
  const IS_COMPANY = isCompany(userInfo)

  useEffect(() => {
    PlausiblePageviewDetail(
      ServicePortalPaths.Root,
      IS_COMPANY ? 'company' : 'person',
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <Box>
      <GridContainer>
        <Greeting compact />
        <Box paddingBottom={1}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <DashboardNotifications limit={isMobile ? 3 : 4} />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <Box marginTop={[1, 2, 2, 0]}>
                <DashboardFeatured items={featured} isMobile={isMobile} />
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
        <Box marginTop={2} paddingBottom={6}>
          {!isMobile && (
            <Text variant="eyebrow" color="purple400" marginBottom={2}>
              {formatMessage(m.moreCategories)}
            </Text>
          )}
          <DashboardModules items={rest} isMobile={isMobile} />
        </Box>
      </GridContainer>
    </Box>
  )
}

export default DashboardV2
