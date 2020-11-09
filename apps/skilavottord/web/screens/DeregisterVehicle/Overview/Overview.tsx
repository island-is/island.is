import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  Box,
  Stack,
  Text,
  Breadcrumbs,
  Button,
  GridColumn,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { Sidenav, NotFound } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { VEHICLES_BY_PARTNER_ID } from '@island.is/skilavottord-web/graphql/queries'
import { useQuery } from '@apollo/client'
import { CarsTable } from './components/CarsTable'

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { deregisterOverview: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const partnerId = user?.partnerId ?? ''
  const { data } = useQuery(VEHICLES_BY_PARTNER_ID, {
    variables: { partnerId },
    fetchPolicy: 'cache-and-network',
  })

  const vehicles = data?.skilavottordRecyclingPartnerVehicles

  const handleDeregister = () => {
    router.push(routes.deregisterVehicle.select)
  }

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <PartnerPageLayout
      side={
        <Sidenav
          title={user.name}
          sections={[
            {
              icon: 'car',
              title: `${sidenavText.deregister}`,
              link: `${routes.deregisterVehicle.baseRoute}`,
            },
            {
              icon: 'business',
              title: `${sidenavText.companyInfo}`,
              link: `${routes.companyInfo.baseRoute}`,
            },
          ]}
          activeSection={0}
        />
      }
    >
      <Stack space={6}>
        <GridColumn span={['8/8', '8/8', '7/8', '7/8']}>
          <Stack space={4}>
            <Breadcrumbs>
              <Link href={routes.home['recyclingCompany']}>Ísland.is</Link>
              <span>{t.title}</span>
            </Breadcrumbs>
            <Stack space={2}>
              <Text variant="h1">{t.title}</Text>
              <Text variant="intro">{t.info}</Text>
            </Stack>
            <Button onClick={handleDeregister}>{t.buttons.deregister}</Button>
          </Stack>
        </GridColumn>
        {vehicles?.length > 0 && (
          <Box marginX={1}>
            <Stack space={4}>
              <Text variant="h3">{t.subtitles.history}</Text>
              <CarsTable titles={t.table} vehicleOwner={vehicles} />
            </Stack>
          </Box>
        )}
      </Stack>
    </PartnerPageLayout>
  )
}

export default Overview
