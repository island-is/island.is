import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { ALL_ACTIVE_RECYCLING_PARTNERS } from '@island.is/skilavottord-web/graphql/queries'
import { ListItem } from '@island.is/skilavottord-web/components'

const CompanyList = () => {
  const { data, error, loading } = useQuery(ALL_ACTIVE_RECYCLING_PARTNERS)

  if (error || (loading && !data)) {
    return null
  }

  const recyclingPartners = data?.skilavottordAllActiveRecyclingPartners || []
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
