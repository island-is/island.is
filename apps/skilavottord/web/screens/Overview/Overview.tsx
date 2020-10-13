import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { Box, Stack, Typography, Breadcrumbs } from '@island.is/island-ui/core'
import { PageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { ActionCard, ProgressCard, Error } from './components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useQuery } from '@apollo/client'
import { GET_VEHICLES } from '@island.is/skilavottord-web/graphql/queries'
import { useRouter } from 'next/router'
import { MockCar } from '@island.is/skilavottord-web/types'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { Unauthorized } from '@island.is/skilavottord-web/components'

const nationalId = '2222222222'

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: {
      myCars: t,
      routes: {
        home: { citizen: homeRoute },
        recycleVehicle: routes,
      },
    },
  } = useI18n()
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_VEHICLES, {
    variables: { nationalId },
  })

  const { cars } = data?.getVehiclesForNationalId || {}

  const onRecycleCar = (id: string) => {
    router
      .push(routes.confirm, `${routes.baseRoute}/${id}/confirm`)
      .then(() => window.scrollTo(0, 0))
  }

  const onOpenProcess = (id: string) => {
    router
      .push(routes.handover, `${routes.baseRoute}/${id}/handover`)
      .then(() => window.scrollTo(0, 0))
  }

  const onSeeDetails = (id: string) => {
    router
      .push(routes.completed, `${routes.baseRoute}/${id}/completed`)
      .then(() => window.scrollTo(0, 0))
  }

  if (!user) {
    return null
  } else if (!hasPermission('recycleVehicle', user?.role as Role)) {
    console.log(user?.role, 'is not allowed to view this page')
    return <Unauthorized />
  }

  return (
    <PageLayout>
      <Box paddingBottom={[3, 3, 6, 6]}>
        <Breadcrumbs>
          <Link href={homeRoute}>Ísland.is</Link>
          <span>{t.title}</span>
        </Breadcrumbs>
      </Box>
      <Box paddingBottom={4}>
        <Typography variant="h1">{t.title}</Typography>
      </Box>
      {error || (loading && !data) ? (
        <Box>{error && <Error />}</Box>
      ) : (
        <Box>
          <Box paddingBottom={10}>
            <Stack space={[2, 2]}>
              <Typography variant="h3">{t.subTitles.pending}</Typography>
              {cars.map((car: MockCar) => (
                <ProgressCard
                  key={car.permno}
                  car={{ ...car, status: 'pendingRecycle' }}
                  onClick={() => onOpenProcess(car.permno)}
                />
              ))}
            </Stack>
          </Box>
          <Box paddingBottom={10}>
            <Stack space={[2, 2]}>
              <Typography variant="h3">{t.subTitles.active}</Typography>
              {cars.length > 0 ? (
                cars.map((car: MockCar) => (
                  <ActionCard
                    key={car.permno}
                    car={car}
                    onContinue={() => onRecycleCar(car.permno)}
                  />
                ))
              ) : (
                <Typography variant="p">{t.info.noCarsAvailable}</Typography>
              )}
            </Stack>
          </Box>
          <Box paddingBottom={10}>
            <Stack space={[2, 2]}>
              <Typography variant="h3">{t.subTitles.done}</Typography>
              {cars.map((car: MockCar) => (
                <ProgressCard
                  key={car.permno}
                  car={{ ...car, status: 'handedOver' }}
                  onClick={() => onSeeDetails(car.permno)}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      )}
    </PageLayout>
  )
}

export default Overview
