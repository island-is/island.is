import React, { useRef } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import { Query, Mutation, GenericLicense } from '@island.is/api/schema'
import { Box, Button, SkeletonLoader } from '@island.is/island-ui/core'
import { EducationCard, EmptyState } from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'

const GenericLicensesQuery = gql`
  query GenericLicensesQuery {
    genericLicenses {
      name
      type
      issuer
    }
  }
`

const LicenseCards = () => {
  const { data, loading: queryLoading } = useQuery<Query>(GenericLicensesQuery)
  const { genericLicenses = [] } = data || {}

  console.log({ data })

  if (queryLoading) {
    return <SkeletonLoader width="100%" height={158} />
  }

  return (
    <>
      {genericLicenses.map((license, index) => (
        <Box marginBottom={3} key={index}>
          Foo!
        </Box>
      ))}
    </>
  )
}

export default LicenseCards
