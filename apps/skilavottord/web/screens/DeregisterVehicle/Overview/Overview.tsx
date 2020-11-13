import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useQuery } from '@apollo/client'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import {
  Box,
  Stack,
  Text,
  Breadcrumbs,
  Button,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  Sidenav,
  NotFound,
  PartnerPageLayout,
} from '@island.is/skilavottord-web/components'
import { CarsTable } from './components/CarsTable'
import {
  ALL_RECYCLING_PARTNERS,
  VEHICLES_BY_PARTNER_ID,
} from '@island.is/skilavottord-web/graphql/queries'
import { RecyclingPartner } from '@island.is/skilavottord-web/types'
import { getDate, getYear } from '@island.is/skilavottord-web/utils/dateUtils'

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { deregisterOverview: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const partnerId = user?.partnerId ?? ''
  const { data: vehicleData } = useQuery(VEHICLES_BY_PARTNER_ID, {
    variables: { partnerId },
    fetchPolicy: 'cache-and-network',
  })

  const { data: partnerData } = useQuery(ALL_RECYCLING_PARTNERS, {
    variables: { partnerId },
  })

  const vehicleOwners = vehicleData?.skilavottordRecyclingPartnerVehicles
  const recyclingPartners = partnerData?.skilavottordAllRecyclingPartners

  const activePartner = recyclingPartners?.filter(
    (partner: RecyclingPartner) => partner.companyId === partnerId,
  )[0]

  const getDeregisteredCars = () => {
    const deregisteredVehicles = []
    const owners = vehicleOwners?.map(({ vehicles }) =>
      vehicles.map(
        ({ vehicleId, vehicleType, newregDate, recyclingRequests }) =>
          recyclingRequests.map(
            ({ requestType, nameOfRequestor, createdAt }) => {
              if (requestType === 'deregistered') {
                deregisteredVehicles.push({
                  vehicleId,
                  vehicleType,
                  modelYear: getYear(newregDate),
                  nameOfRequestor,
                  deregistrationDate: getDate(createdAt),
                })
              }
            },
          ),
      ),
    )
    return deregisteredVehicles
  }

  const handleDeregister = () => {
    router.push(routes.deregisterVehicle.select)
  }

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  const deregisteredVehicles = getDeregisteredCars()

  return (
    <PartnerPageLayout
      side={
        <Sidenav
          title={activePartner?.companyName || user.name}
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
        {deregisteredVehicles?.length > 0 && (
          <Box marginX={1}>
            <Stack space={4}>
              <Text variant="h3">{t.subtitles.history}</Text>
              <CarsTable
                titles={t.table}
                deregisteredVehicles={deregisteredVehicles}
              />
            </Stack>
          </Box>
        )}
      </Stack>
    </PartnerPageLayout>
  )
}

export default Overview
