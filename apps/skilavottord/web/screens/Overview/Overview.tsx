import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { Box, Stack, Text, Breadcrumbs } from '@island.is/island-ui/core'
import { PageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { ActionCard, ProgressCard } from './components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useQuery } from '@apollo/client'
import { GET_VEHICLES } from '@island.is/skilavottord-web/graphql/queries'
import { useRouter } from 'next/router'
import { MockCar } from '@island.is/skilavottord-web/types'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import {
  Unauthorized,
  InlineError,
} from '@island.is/skilavottord-web/components'

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
    variables: { nationalId: user?.nationalId },
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
        <Text variant="h1">{t.title}</Text>
      </Box>
      {error || (loading && !data) ? (
        <Box>
          {error && (
            <InlineError
              title={t.subTitles.active}
              message={t.error.message}
              primaryButton={{
                text: t.error.primaryButton,
                action: () => router.reload(),
              }}
            />
          )}
        </Box>
      ) : (
        <Box>
          <Box paddingBottom={10}>
            <Stack space={[2, 2]}>
              <Text variant="h3">{t.subTitles.pending}</Text>
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
              <Text variant="h3">{t.subTitles.active}</Text>
              {cars.length > 0 ? (
                cars.map((car: MockCar) => (
                  <ActionCard
                    key={car.permno}
                    car={car}
                    onContinue={() => onRecycleCar(car.permno)}
                  />
                ))
              ) : (
                <Text>{t.info.noCarsAvailable}</Text>
              )}
            </Stack>
          </Box>
          <Box paddingBottom={10}>
            <Stack space={[2, 2]}>
              <Text variant="h3">{t.subTitles.done}</Text>
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
