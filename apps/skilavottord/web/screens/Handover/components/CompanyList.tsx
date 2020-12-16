import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { ListItem } from '@island.is/skilavottord-web/components'
import { filterInternalPartners } from '@island.is/skilavottord-web/utils'

const skilavottordAllActiveRecyclingPartnersQuery = gql`
  query skilavottordAllActiveRecyclingPartnersQuery {
    skilavottordAllActiveRecyclingPartners {
      companyId
      companyName
      address
      postnumber
      city
      website
      phone
    }
  }
`

const CompanyList = () => {
  const { data, error, loading } = useQuery(
    skilavottordAllActiveRecyclingPartnersQuery,
  )

  if (error || (loading && !data)) {
    return null
  }

  const activePartners = data?.skilavottordAllActiveRecyclingPartners || []
  const recyclingPartners = filterInternalPartners(activePartners)

  const sortedPartners = recyclingPartners.slice().sort((a, b) => {
    return a.city < b.city ? -1 : 1
  })

  return (
    <Box>
      {sortedPartners.map((partner, index) => (
        <ListItem
          key={index}
          title={`${partner.companyName} (${partner.city})`}
          content={[
            {
              text: `${partner.address}, ${partner.postnumber} ${partner.city}`,
            },
            {
              text: `${partner.phone}`,
              isHighlighted: true,
            },
            {
              text: `${partner.website}`,
              href: partner.website,
            },
          ]}
        />
      ))}
    </Box>
  )
}

export default CompanyList
