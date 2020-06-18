import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Hidden,
  BulletList,
  Bullet,
  Columns,
  Column,
  Stack,
  Icon,
  Box,
  Button,
  Typography,
} from '@island.is/island-ui/core'

import { ContentLoader, Layout } from '@island.is/gjafakort-web/components'
import { NotFound } from '@island.is/gjafakort-web/screens'

import { Info } from '../components'
import { FormInfo } from './components'

const CompanyApplicationQuery = gql`
  query CompanyApplicationQuery($ssn: String!) {
    user {
      role
    }

    companyApplication(ssn: $ssn) {
      id
      name
      email
      state
      companySSN
      serviceCategory
      generalEmail
      companyDisplayName
      companyName
      exhibition
      operatingPermitForRestaurant
      operatingPermitForVehicles
      operationsTrouble
      phoneNumber
      validLicenses
      validPermit
      webpage
      logs {
        id
        state
        title
        data
        authorSSN
      }
    }
  }
`

function Application() {
  const router = useRouter()
  const { ssn } = router.query
  const { data, loading } = useQuery(CompanyApplicationQuery, {
    variables: { ssn },
  })
  const { companyApplication: application, user } = data || {}

  if (loading && !data) {
    return <ContentLoader />
  } else if (!application) {
    return <NotFound />
  }

  return (
    <Layout
      left={
        <Box
          background="blue100"
          position="relative"
          paddingX={[5, 12]}
          paddingY={[5, 9]}
          width="full"
        >
          <Box marginBottom={2}>
            <Box marginBottom={1}>
              <Typography variant="h1" as="h1">
                {application.companyName}
              </Typography>
            </Box>
            <Typography variant="h3" as="h2" color="blue400">
              {application.companyDisplayName}
            </Typography>
          </Box>

          {user.role === 'developer' ? (
            <FormInfo application={application} />
          ) : (
            <Info application={application} />
          )}
        </Box>
      }
    />
  )
}

export default Application
