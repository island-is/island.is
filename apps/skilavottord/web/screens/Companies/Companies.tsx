import React from 'react'
import { Stack, Typography } from '@island.is/island-ui/core'
import { PageLayout } from '../Layouts'
import CompanyList from './components/CompanyList'

const RecyclingCompanies = (props) => {
  const { companies } = props

  return (
    <PageLayout>
      <Stack space={3}>
        <Typography variant="h1">Recycle your car</Typography>
        <Stack space={4}>
          <Stack space={2}>
            <Typography variant="h3">Car recycling companies</Typography>
            <Typography variant="p">
              These are the connected recycling coompanies where you can recycle
              your car using the digital service. To reycle your car you must
              first login and mark it for recycling for the recycling company to
              be able to accept your car.
            </Typography>
          </Stack>
          <Typography variant="h3">Recycling companies</Typography>
          <CompanyList companies={companies} />
        </Stack>
      </Stack>
    </PageLayout>
  )
}

RecyclingCompanies.getInitialProps = () => {
  const companies = [
    {
      name: 'Company 1',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
    {
      name: 'Company 2',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
    {
      name: 'Company 3',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
  ]

  return { companies }
}

export default RecyclingCompanies
