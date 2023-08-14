import React, { FC } from 'react'
import { Box, Stack, Text, Link } from '@island.is/island-ui/core'

import * as styles from './CompanyList.css'

interface CompanyListProps {
  recyclingPartners: RecyclingPartner[]
}

export interface RecyclingPartner {
  companyName: string
  address: string
  postnumber: string
  city: string
  phone: string
  website: string
}

export const CompanyList: FC<React.PropsWithChildren<CompanyListProps>> = ({
  recyclingPartners,
}) => {
  const sortedPartners = recyclingPartners.slice().sort((a, b) => {
    return a.city < b.city ? -1 : 1
  })

  const createLink = (link: string) => {
    return link.indexOf('https://') === -1 ? `https://${link}` : link
  }

  return (
    <Box>
      {sortedPartners.map((partner, index) => (
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

export default CompanyList
