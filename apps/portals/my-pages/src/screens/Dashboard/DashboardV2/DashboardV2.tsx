import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './DashboardV2.css'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  PlausiblePageviewDetail,
  ServicePortalPaths,
  m,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { isCompany } from '@island.is/shared/utils'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import Greeting from '../../../components/Greeting/Greeting'
import { DashboardFeatured } from './DashboardFeatured'
import { DashboardModules } from './DashboardModules'
import { DashboardNotifications } from './DashboardNotifications'
import { useDashboardNav } from './useDashboardNav'

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
      <Greeting compact />
      <GridContainer>
        <Box paddingBottom={[1, 2]}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <DashboardNotifications limit={4} />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <Box marginTop={[1, 2, 2, 0]}>
                <DashboardFeatured items={featured} isMobile={isMobile} />
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>

      <div className={styles.whiteSection}>
        <GridContainer>
          <Box paddingBottom={6}>
            <Text
              variant="eyebrow"
              as="h2"
              color="purple400"
              marginBottom={2}
              marginTop={2}
            >
              {formatMessage(m.moreCategories)}
            </Text>
            <DashboardModules items={rest} isMobile={isMobile} />
          </Box>
        </GridContainer>
      </div>
    </Box>
  )
}

export default DashboardV2
