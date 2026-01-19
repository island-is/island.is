import type { FC, ReactNode } from 'react'

import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Tabs,
} from '@island.is/island-ui/core'
import { PortalNavigation, PortalNavigationItem } from '@island.is/portals/core'
import CombinedOverview from '../../screens/Overview/CombinedOverview'
import { useLocale } from '@island.is/localization'
import { ApplicationSystemPaths } from '../../lib/paths'
import { m } from '../../lib/messages'
import { applicationSystemNavigation } from '../../lib/navigation'
import Statistics from '../../screens/Statistics/Statistics'

interface LayoutProps {
  isSuperAdmin: boolean
}

export const Layout: FC<React.PropsWithChildren<LayoutProps>> = ({
  isSuperAdmin,
}) => {
  const { formatMessage } = useLocale()
  return (
    <GridContainer>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          {
            title: formatMessage(m.applicationSystem),
            href: `/stjornbord${ApplicationSystemPaths.Root}`,
          },
        ]}
      />
      <GridRow rowGap={'gutter'} marginTop={4}>
        <GridColumn
          span={['12/12', '12/12', '12/12', '12/12', '12/12']}
          order={[2, 2, 2, 0]}
        >
          <Box position="sticky" top={4}>
            {/* <PortalNavigation title={navTitle} navigation={navItems} /> */}
            <Tabs
              label="test"
              contentBackground="white"
              selected="overview"
              tabs={[
                {
                  id: 'overview',
                  label: formatMessage(m.overview),
                  content: <CombinedOverview isSuperAdmin={isSuperAdmin} />,
                },
                {
                  id: 'statistics',
                  label: formatMessage(m.statistics),
                  content: <Statistics isSuperAdmin={isSuperAdmin} />,
                },
              ]}
            />
          </Box>
        </GridColumn>
        {/* <GridColumn
          span={['12/12', '12/12', '12/12', '8/12']}
          offset={['0', '0', '0', '0', '1/12']}
          order={[2, 2, 2, 0]}
        >
          {children}
        </GridColumn> */}
      </GridRow>
    </GridContainer>
  )
}
