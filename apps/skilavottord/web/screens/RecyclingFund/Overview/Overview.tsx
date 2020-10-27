import React, { FC, useContext } from 'react'
import {
  Box,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import CarsTable from './components/CarsTable'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { useRouter } from 'next/router'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { Unauthorized } from '@island.is/skilavottord-web/components'

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { recyclingFundOverview: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const handleDeregister = () => {
    router.push(routes.deregisterVehicle.select)
  }

  if (!user) {
    return null
  } else if (!hasPermission('recycledVehicles', user?.role as Role)) {
    console.log(user?.role, 'is not allowed to view this page')
    return <Unauthorized />
  }

  return (
    <PartnerPageLayout
      top={
        <Box>
          <Stack space={6}>
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h1">{t.title}</Text>
              </Stack>
            </Stack>
            <Text variant="h3">{t.subtitles.deregistered}</Text>
          </Stack>
        </Box>
      }
      bottom={<CarsTable />}
      left={
        <Sidenav
          title={sidenavText.title}
          sections={[
            {
              icon: 'car',
              title: `${sidenavText.recycled}`,
              link: `${routes.recycledVehicles}`,
            },
            {
              icon: 'business',
              title: `${sidenavText.companies}`,
              link: `${routes.recyclingCompanies.baseRoute}`,
            },
          ]}
          activeSection={0}
        />
      }
    />
  )
}

export default Overview
