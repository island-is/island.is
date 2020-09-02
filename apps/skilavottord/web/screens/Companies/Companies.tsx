import React, { FC } from 'react'
import { Box, Breadcrumbs, Stack, Typography } from '@island.is/island-ui/core'
import Link from 'next/link'
import { PageLayout } from '../Layouts'
import CompanyList from './components/CompanyList'

const RecyclingCompanies: FC = () => (
  <PageLayout>
    <Box paddingBottom={6}>
      <Breadcrumbs>
        <Link href={'./'}>
          <a>Ísland.is</a>
        </Link>
        <span>Content information</span>
        <span>Car recycling companies</span>
      </Breadcrumbs>
    </Box>
    <Box paddingBottom={10}>
      <Stack space={[2, 2]}>
        <Typography variant="h1" as="h1">
          Car recycling companies
        </Typography>
        <Typography variant="intro">
          Here you can find all recycling companies connected to this digital
          recycling service.
        </Typography>
      </Stack>
    </Box>
    <Box paddingBottom={10}>
      <CompanyList />
    </Box>
  </PageLayout>
)

export default RecyclingCompanies
