import React, { FC } from 'react'
import Link from 'next/link'
import { Box, Stack, Typography, Breadcrumbs } from '@island.is/island-ui/core'
import { PageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { ActionCard, ProgressCard, Error } from './components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useQuery } from '@apollo/client'
import { GET_VEHICLES } from '@island.is/skilavottord-web/graphql/queries'
import { useRouter } from 'next/router'
import { MockCar } from '@island.is/skilavottord-web/types'

const nationalId = '2222222222'

const Overview: FC = () => {
  const { data, loading, error } = useQuery(GET_VEHICLES, {
    variables: { nationalId },
  })

  const {
    t: {
      myCars: t,
      routes: { recycleVehicle: routes },
    },
  } = useI18n()
  const router = useRouter()

  if (error || (loading && !data)) {
    return <PageWrapper t={t}>{error && <Error />}</PageWrapper>
  }

  const { cars } = data.getVehiclesForNationalId || {}

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

  return (
    <PageWrapper t={t}>
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
    </PageWrapper>
  )
}

const PageWrapper = ({ children, t }) => {
  return (
    <PageLayout>
      <Box paddingBottom={6}>
        <Breadcrumbs>
          <Link href={'./'}>
            <a>Ísland.is</a>
          </Link>
          <span>{t.title}</span>
        </Breadcrumbs>
      </Box>
      <Box paddingBottom={4}>
        <Typography variant="h1">{t.title}</Typography>
      </Box>
      {children}
    </PageLayout>
  )
}

export default Overview
