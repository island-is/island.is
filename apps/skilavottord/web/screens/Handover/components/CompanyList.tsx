import React from 'react'
import { Box } from '@island.is/island-ui/core'
import CompanyListItem from './CompanyListItem'
import { useQuery } from '@apollo/client'
import { GET_ALL_ACTIVE_RECYCLING_PARTNERS } from '@island.is/skilavottord-web/graphql/queries'

const CompanyList = () => {
  const { data, error, loading } = useQuery(GET_ALL_ACTIVE_RECYCLING_PARTNERS)

  if (error || (loading && !data)) {
    return null
  }

  const recyclingPartners = data?.getAllActiveRecyclingPartners
  const sortedPartners = recyclingPartners.slice().sort((a, b) => {
    return a.city < b.city ? -1 : 1
  })

  return (
    <Box>
      {sortedPartners.map((partner, index) => (
        <CompanyListItem key={index} {...partner} />
      ))}
    </Box>
  )
}

export default CompanyList
