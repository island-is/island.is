import React, { FC, useContext } from 'react'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { Stack, Text } from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { Sidenav, NotFound } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { useQuery } from '@apollo/client'
import { CarsTable } from './components/CarsTable'
import { ALL_DEREGISTERED_VEHICLES } from '@island.is/skilavottord-web/graphql/queries'

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { recyclingFundOverview: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  const { data } = useQuery(ALL_DEREGISTERED_VEHICLES)
  const vehicles = data?.skilavottordAllDeregisteredVehicles ?? []

  if (!user) {
    return null
  } else if (!hasPermission('recycledVehicles', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <PartnerPageLayout
      side={
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
    >
      <Stack space={4}>
        <Text variant="h1">{t.title}</Text>
        <Text variant="h3">{t.subtitles.deregistered}</Text>
        {vehicles.length > 0 ? (
          <CarsTable titles={t.table} vehicles={vehicles} />
        ) : (
          <Text>{t.info}</Text>
        )}
      </Stack>
    </PartnerPageLayout>
  )
}

export default Overview
