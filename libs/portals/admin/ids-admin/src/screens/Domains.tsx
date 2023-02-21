import {
  Hidden,
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Stack,
} from '@island.is/island-ui/core'
import { Outlet, useParams } from 'react-router-dom'
import { PortalNavigation } from '@island.is/portals/core'
import React from 'react'
import { idsAdminNavigation } from '../lib/navigation'

const Domains = () => {
  const params = useParams()

  return (
    <GridContainer>
      <Hidden above="md">
        <Box paddingBottom={4}>
          <PortalNavigation navigation={idsAdminNavigation} />
        </Box>
      </Hidden>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '4/12', '3/12']}
          order={[2, 2, 2, 0]}
        >
          <Stack space={3}>
            <Hidden below="lg">
              <PortalNavigation navigation={idsAdminNavigation} />
            </Hidden>
          </Stack>
        </GridColumn>
      </GridRow>
      <Box>
        <Outlet />
      </Box>
    </GridContainer>
  )
}

export default Domains
