import React, { FC } from 'react'
import Link from 'next/link'
import { Box, Stack, Typography, Breadcrumbs } from '@island.is/island-ui/core'
import { PageLayout } from '../Layouts'
import { ActionCard, ProgressCard } from './components'
import { useRouter } from 'next/router'

import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'

import { cars } from './cars.json'
import { useI18n } from '@island.is/skilavottord-web/i18n'

const Overview: FC = () => {
  const Router = useRouter()
  const { makePath } = useRouteNames()
  const {
    t: { myCars: t },
  } = useI18n()

  const onClick = (id) => {
    Router.push({
      pathname: makePath('myCars', id),
    })
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
          {cars
            .filter((car) => {
              if (car.status === 'pending') {
                return car
              }
            })
            .map((car, index) => (
              <ProgressCard key={index} car={car} />
            ))}
        </Stack>
      </Box>
      <Box paddingBottom={10}>
        <Stack space={[2, 2]}>
          <Typography variant="h3">{t.subTitles.active}</Typography>
          {cars
            .filter((car) => {
              if (car.status === 'enabled' || car.status === 'disabled') {
                return car
              }
            })
            .map((car) => (
              <ActionCard
                key={car.id}
                onClick={() => onClick(car.id)}
                car={car}
              />
            ))}
        </Stack>
      </Box>
      <Box paddingBottom={10}>
        <Stack space={[2, 2]}>
          <Typography variant="h3">{t.subTitles.done}</Typography>
          {cars
            .filter((car) => {
              if (car.status === 'recycled') {
                return car
              }
            })
            .map((car) => (
              <ProgressCard key={car.id} car={car} />
            ))}
        </Stack>
      </Box>
    </PageLayout>
  )
}

export default Overview
