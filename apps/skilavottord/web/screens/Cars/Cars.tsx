import React, { FC } from 'react'
import Link from 'next/link'
import { Box, Stack, Typography, Breadcrumbs } from '@island.is/island-ui/core'
import { PageLayout } from '../Layouts'
import CompanyList from '../Companies/components/CompanyList'
import { CarAction } from '@island.is/skilavottord-web/screens/Cars/components/CarAction/CarAction'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'

const Cars: FC = () => {
  const { makePath } = useRouteNames()

  return (
    <PageLayout>
      <Box paddingBottom={6}>
        <Breadcrumbs>
          <Link href={'./'}>
            <a>Ísland.is</a>
          </Link>
          <span>Content information</span>
          <span>Recycle your car</span>
        </Breadcrumbs>
      </Box>
      <Box paddingBottom={10}>
        <Stack space={[2, 2]}>
          <Typography variant="h1">Recycle your car</Typography>
          <Typography variant="intro">
            Here you can see your cars and select the car you want to recycle.
            Once you hace sucessfully marked the car for recycling you can
            contact any of the recyclingcompanies connected to the service.
          </Typography>
        </Stack>
      </Box>
      <Stack space={[2, 2]}>
        <Typography variant="h3">Your cars</Typography>
        <Box paddingBottom={10}>
          <CarAction
            href={makePath('myPage')}
            title="BVZ655"
            description="Volvo V70, 2006 | Money back 20000 kr"
            status="Ready"
          />
        </Box>
      </Stack>
      <Box paddingBottom={10}>
        <CompanyList />
      </Box>
    </PageLayout>
  )
}

export default Cars
