import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import {
  Box,
  Stack,
  Text,
  BreadcrumbsDeprecated as Breadcrumbs,
  Button,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  Sidenav,
  NotFound,
  PartnerPageLayout,
} from '@island.is/skilavottord-web/components'
import {
  RecyclingPartner,
  RecyclingRequest,
  Vehicle,
  VehicleOwner,
  Query,
} from '@island.is/skilavottord-web/graphql/schema'
import { getDate, getYear } from '@island.is/skilavottord-web/utils/dateUtils'
import { BASE_PATH } from '@island.is/skilavottord/consts'
import { CarsTable } from './components/CarsTable'

export const SkilavottordRecyclingPartnerVehiclesQuery = gql`
  query skilavottordRecyclingPartnerVehiclesQuery($partnerId: String!) {
    skilavottordRecyclingPartnerVehicles(partnerId: $partnerId) {
      nationalId
      vehicles {
        vehicleId
        vehicleType
        newregDate
        recyclingRequests {
          id
          requestType
          nameOfRequestor
          createdAt
        }
      }
    }
  }
`

const SkilavottordAllRecyclingPartnersQuery = gql`
  query skilavottordAllRecyclingPartnersQuery {
    skilavottordAllRecyclingPartners {
      companyId
      companyName
    }
  }
`

export interface DeregisteredVehicle {
  vehicleId: string
  vehicleType: string
  modelYear: string
  nameOfRequestor: string
  deregistrationDate: string
}

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { deregisterOverview: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const partnerId = user?.partnerId
  const { data: vehicleData } = useQuery<Query>(
    SkilavottordRecyclingPartnerVehiclesQuery,
    {
      variables: { partnerId },
      fetchPolicy: 'cache-and-network',
      skip: !partnerId,
    },
  )

  const { data: partnerData } = useQuery<Query>(
    SkilavottordAllRecyclingPartnersQuery,
    {
      variables: { partnerId },
    },
  )

  const vehicleOwners = vehicleData?.skilavottordRecyclingPartnerVehicles
  const recyclingPartners = partnerData?.skilavottordAllRecyclingPartners

  const activePartner = recyclingPartners?.filter(
    (partner: RecyclingPartner) => partner.companyId === partnerId,
  )[0]

  const getDeregisteredCars = () => {
    const deregisteredVehicles = [] as DeregisteredVehicle[]
    const owners = vehicleOwners?.map(({ vehicles }: VehicleOwner) =>
      vehicles.map(
        ({
          vehicleId,
          vehicleType,
          newregDate,
          recyclingRequests,
        }: Vehicle) => {
          return recyclingRequests.map((request: RecyclingRequest) => {
            const { requestType, nameOfRequestor, createdAt } = request
            if (requestType === 'deregistered') {
              deregisteredVehicles.push({
                vehicleId,
                vehicleType,
                modelYear: getYear(newregDate),
                nameOfRequestor,
                deregistrationDate: getDate(createdAt),
              })
            }
            return request
          })
        },
      ),
    )
    return deregisteredVehicles
  }

  const handleDeregister = () => {
    router.push(`${routes.deregisterVehicle.select}`)
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
          title={activePartner?.companyName || sidenavText.title}
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
              <Link href={`${BASE_PATH}${routes.home['recyclingCompany']}`}>
                Ísland.is
              </Link>
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
