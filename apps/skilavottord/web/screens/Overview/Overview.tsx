import React, { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import {
  Box,
  Stack,
  Text,
  BreadcrumbsDeprecated as Breadcrumbs,
  SkeletonLoader,
} from '@island.is/island-ui/core'

import { PageLayout, InlineError } from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { Query } from '@island.is/skilavottord-web/graphql/schema'

import { filterCarsByStatus } from '@island.is/skilavottord-web/utils'
import { BASE_PATH } from '@island.is/skilavottord/consts'

import { ActionCardContainer, ProgressCardContainer } from './components'
import { RecycleActionTypes } from './types'

const SkilavottordVehiclesQuery = gql`
  query skilavottordVehiclesQuery {
    skilavottordVehicles {
      permno
      vinNumber
      type
      color
      firstRegDate
      isRecyclable
      hasCoOwner
      status
    }
  }
`

const Overview: FC<React.PropsWithChildren<unknown>> = () => {
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

  const { data, loading, error } = useQuery<Query>(SkilavottordVehiclesQuery, {
    fetchPolicy: 'cache-and-network',
  })

  const cars = data?.skilavottordVehicles || []

  const pendingCars = filterCarsByStatus('pendingRecycle', cars)
  const inUseCars = filterCarsByStatus('inUse', cars)
  const recycledCars = filterCarsByStatus('deregistered', cars)

  const onContinue = (id: string, actionType: RecycleActionTypes) => {
    router
      .push(`${routes[actionType]}`, `${routes.baseRoute}/${id}/${actionType}`)
      .then(() => window.scrollTo(0, 0))
  }

  if (error || loading) {
    return (
      <PageLayout>
        <Box paddingBottom={[3, 3, 6, 6]}>
          <Breadcrumbs>
            <Link href={`${BASE_PATH}${homeRoute}`}>Ísland.is</Link>
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
          <Link href={`${BASE_PATH}${homeRoute}`}>Ísland.is</Link>
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
              actionType="recycle"
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
