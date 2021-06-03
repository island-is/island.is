import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const GenericLicensesQuery = gql`
  query GenericLicensesQuery {
    genericLicenses {
      licenseType
      nationalId
      expidationDate
      payload {
        data
        rawData
      }
    }
  }
`

const LicenseCards = () => {
  const { data, loading: queryLoading } = useQuery<Query>(GenericLicensesQuery)
  const { genericLicenses = [] } = data || {}

  if (queryLoading) {
    return <SkeletonLoader width="100%" height={158} />
  }

  return (
    <>
      {genericLicenses.map((license, index) => (
        <Box marginBottom={3} key={index}>
          <p>Kennitala: {license.nationalId}</p>
          <p>Gerð: {license.licenseType}</p>
        </Box>
      ))}
    </>
  )
}

export default LicenseCards
