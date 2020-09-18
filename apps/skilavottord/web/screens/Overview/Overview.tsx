import React, { FC } from 'react'
import Link from 'next/link'
import { Box, Stack, Typography, Breadcrumbs } from '@island.is/island-ui/core'
import { PageLayout } from '../Layouts'
import { ActionCard, ProgressCard } from './components'

import { carsMock } from './cars.json'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useQuery } from '@apollo/client'
import { GET_USER } from '@island.is/skilavottord-web/graphql/queries'

const nationalId = '2222222222'

const Overview: FC = () => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { nationalId },
  })

  const {
    t: { myCars: t },
  } = useI18n()

  if (error || (loading && !data)) {
    return <>ERROR</>
  }
  const { cars } = data.getCarownerByNationalId || {}

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
          {carsMock
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
          {cars.map((car) => (
            <ActionCard key={car.id} car={car} />
          ))}
        </Stack>
      </Box>
      <Box paddingBottom={10}>
        <Stack space={[2, 2]}>
          <Typography variant="h3">{t.subTitles.done}</Typography>
          {carsMock
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
