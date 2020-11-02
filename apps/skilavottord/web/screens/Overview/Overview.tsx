import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { Box, Stack, Text, Breadcrumbs } from '@island.is/island-ui/core'
import { PageLayout } from '@island.is/skilavottord-web/components/Layouts'
import {
  ActionCard,
  ActionCardContainer,
  ProgressCardContainer,
} from './components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useQuery } from '@apollo/client'
import {
  GET_VEHICLES,
  GET_OLD_VEHICLES,
} from '@island.is/skilavottord-web/graphql/queries'
import { useRouter } from 'next/router'
import { MockCar, RecycleActionTypes } from '@island.is/skilavottord-web/types'
import { UserContext } from '@island.is/skilavottord-web/context'
import { InlineError } from '@island.is/skilavottord-web/components'

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

  // const nationalId = user?.nationalId ?? ''
  // const { data, loading, error } = useQuery(GET_VEHICLES, {
  //   variables: { nationalId },
  // })

  const nationalId = '2222222222'
  const { data, loading, error } = useQuery(GET_OLD_VEHICLES, {
    variables: { nationalId },
  })

  const { cars } = data?.getVehiclesForNationalId || []

  const pendingCars = cars?.filter(
    (car: MockCar) => car.status !== 'pendingRecycle',
  )
  const notStartedCars = cars?.filter(
    (car: MockCar) => car.status !== 'notStarted' || car.status === undefined,
  )
  const recycledCars = cars?.filter(
    (car: MockCar) => car,
    // car.status === 'deregisterred' ||
    // car.status === 'paymentInitiated' ||
    // car.status === 'paymentFailed',
  )

  const onContinue = (id: string, actionType: RecycleActionTypes) => {
    router
      .push(routes[actionType], `${routes.baseRoute}/${id}/${actionType}`)
      .then(() => window.scrollTo(0, 0))
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
        <Stack space={[3, 3, 4, 4]}>
          {pendingCars.length > 0 && (
            <ProgressCardContainer
              title={t.subTitles.pending}
              cars={pendingCars}
              actionType="handover"
              onContinue={onContinue}
              status="pendingRecycle"
            />
          )}
          <Stack space={[2, 2]}>
            <Text variant="h3">{t.subTitles.active}</Text>
            {notStartedCars.length > 0 ? (
              <ActionCardContainer
                cars={notStartedCars}
                actionType="confirm"
                onContinue={onContinue}
              />
            ) : (
              <Text>{t.info.noCarsAvailable}</Text>
            )}
          </Stack>
          {recycledCars.length > 0 && (
            <ProgressCardContainer
              title={t.subTitles.done}
              cars={recycledCars}
              actionType="completed"
              onContinue={onContinue}
              status="handedOver"
            />
          )}
        </Stack>
      )}
    </PageLayout>
  )
}

export default Overview
