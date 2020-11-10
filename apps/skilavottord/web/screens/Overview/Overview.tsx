import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  Box,
  Stack,
  Text,
  Breadcrumbs,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { PageLayout, InlineError } from '@island.is/skilavottord-web/components'
import { ActionCardContainer, ProgressCardContainer } from './components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { RecycleActionTypes } from '@island.is/skilavottord-web/types'
import { UserContext } from '@island.is/skilavottord-web/context'
import { filterCarsByStatus } from '@island.is/skilavottord-web/utils'
import { VEHICLES_BY_NATIONAL_ID } from '@island.is/skilavottord-web/graphql/queries'

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

  const nationalId = user?.nationalId
  const { data, loading, error } = useQuery(VEHICLES_BY_NATIONAL_ID, {
    variables: { nationalId },
    fetchPolicy: 'cache-and-network',
    skip: !nationalId
  })

  const cars = data?.skilavottordVehicles || []

  const pendingCars = filterCarsByStatus('pendingRecycle', cars)
  const inUseCars = filterCarsByStatus('inUse', cars)
  const recycledCars = filterCarsByStatus('deregistered', cars)

  const onContinue = (id: string, actionType: RecycleActionTypes) => {
    router
      .push(routes[actionType], `${routes.baseRoute}/${id}/${actionType}`)
      .then(() => window.scrollTo(0, 0))
  }

  if (error || loading) {
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
        {error ? (
          <InlineError
            title={t.subTitles.active}
            message={t.error.message}
            primaryButton={{
              text: t.error.primaryButton,
              action: () => router.reload(),
            }}
          />
        ) : (
          <SkeletonLoader space={2} repeat={4} />
        )}
      </PageLayout>
    )
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
      <Stack space={[3, 3, 4, 4]}>
        {pendingCars.length > 0 && (
          <ProgressCardContainer
            title={t.subTitles.pending}
            cars={pendingCars}
            actionType="handover"
            onContinue={onContinue}
          />
        )}
        <Stack space={[2, 2]}>
          <Text variant="h3">{t.subTitles.active}</Text>
          {inUseCars.length > 0 ? (
            <ActionCardContainer
              cars={inUseCars}
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
          />
        )}
      </Stack>
    </PageLayout>
  )
}

export default Overview
