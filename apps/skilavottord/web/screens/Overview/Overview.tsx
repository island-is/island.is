import React, { FC } from 'react'
import Link from 'next/link'
import { Box, Stack, Typography, Breadcrumbs } from '@island.is/island-ui/core'
import { PageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { ActionCard, ProgressCard } from './components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useQuery } from '@apollo/client'
import { GET_CAR_OWNER } from '@island.is/skilavottord-web/graphql/queries'
import { useRouter } from 'next/router'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'

const nationalId = '2222222222'

const Overview: FC = () => {
  const { data, loading, error } = useQuery(GET_CAR_OWNER, {
    variables: { nationalId },
  })

  const {
    t: { myCars: t },
  } = useI18n()
  const router = useRouter()
  const { makePath } = useRouteNames()

  if (error || (loading && !data)) {
    return <>Loading</>
  }

  const { cars } = data.getCarownerByNationalId || {}

  const onRecycleCar = (id: string) => {
    router.push(
      '/recycle-vehicle/[id]/confirm',
      makePath('recycleVehicle', id, 'confirm'),
    )
  }

  const onOpenProcess = (id: string) => {
    router.push(
      '/recycle-vehicle/[id]/handover',
      makePath('recycleVehicle', id, 'handover'),
    )
  }

  const onSeeDetails = (id: string) => {
    router.push(
      '/recycle-vehicle/[id]/completed',
      makePath('recycleVehicle', id, 'completed'),
    )
  }

  return (
    <PageLayout>
      <Box paddingBottom={6}>
        <Breadcrumbs>
          <Link href={'./'}>
            <a>Ísland.is</a>
          </Link>
          <span>Content information</span>
          <span>{t.title}</span>
        </Breadcrumbs>
      </Box>
      <Box paddingBottom={4}>
        <Typography variant="h1">{t.title}</Typography>
      </Box>
      <Box paddingBottom={10}>
        <Stack space={[2, 2]}>
          <Typography variant="h3">{t.subTitles.pending}</Typography>
          {cars.map((car, index) => (
            <ProgressCard
              key={index}
              car={car}
              onClick={() => onOpenProcess(car.id)}
            />
          ))}
        </Stack>
      </Box>
      <Box paddingBottom={10}>
        <Stack space={[2, 2]}>
          <Typography variant="h3">{t.subTitles.active}</Typography>
          {cars.length > 0 ? (
            cars.map((car) => (
              <ActionCard
                key={car.id}
                car={car}
                onContinue={() => onRecycleCar(car.id)}
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
          {cars.map((car) => (
            <ProgressCard
              key={car.id}
              car={{ ...car, status: 'done' }}
              onClick={() => onSeeDetails(car.id)}
            />
          ))}
        </Stack>
      </Box>
    </PageLayout>
  )
}

export default Overview
