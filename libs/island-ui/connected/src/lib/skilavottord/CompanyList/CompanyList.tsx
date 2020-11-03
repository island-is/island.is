import React from 'react'
import { Box, Stack, Text, Link } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import * as styles from './CompanyList.treat'

export interface RecyclingPartner {
  companyId: string
  companyName: string
  address: string
  postnumber: string
  city: string
  website: string
  phone: string
  active: boolean
}

export const RECYCLING_PARTNERS = gql`
  query skilavottordAllActiveRecyclingPartners {
    skilavottordAllActiveRecyclingPartners {
      companyId
      companyName
      address
      postnumber
      city
      website
      phone
      active
    }
  }
`

export const SkilavottordCompanyList = () => {
  const { data, error, loading } = useQuery(RECYCLING_PARTNERS)

  if (error || (loading && !data)) {
    return null
  }

  const recyclingPartners = data?.skilavottordAllActiveRecyclingPartners || []
  const sortedPartners = recyclingPartners
    .slice()
    .sort((a: RecyclingPartner, b: RecyclingPartner) => {
      return a.city < b.city ? -1 : 1
    })

  const createLink = (link: string) => {
    return link.indexOf('http://') === -1 ? `https://${link}` : link
  }

  return (
    <Box>
      {sortedPartners.map((partner: RecyclingPartner, index: number) => (
        <Box
          key={index}
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          flexWrap="wrap"
          paddingX={[0, 0, 3, 3]}
          paddingY={[3, 3, 3, 3]}
          className={styles.container}
        >
          <Box paddingBottom={[2, 2, 0, 0]}>
            <Stack space={[2, 2, 1, 1]}>
              <Text variant="h5">{`${partner.companyName} (${partner.city})`}</Text>
              <Text>{`${partner.address}, ${partner.postnumber} ${partner.city}`}</Text>
              <Text color="blue400">{partner.phone}</Text>
              <Text color="blue400">
                <Link
                  href={createLink(partner.website)}
                  color="blue400"
                  underline="small"
                >
                  {partner.website}
                </Link>
              </Text>
            </Stack>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default SkilavottordCompanyList
