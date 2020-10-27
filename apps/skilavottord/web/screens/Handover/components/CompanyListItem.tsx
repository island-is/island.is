import React, { FC, ReactNode } from 'react'
import { Stack, Text, Box, Link } from '@island.is/island-ui/core'
import * as styles from './CompanyListItem.treat'

export interface CompanyProps {
  companyName: string
  address: string
  city: string
  postnumber: string
  phone: string
  website: string
  buttons?: ReactNode
}

export const CompanyListItem: FC<CompanyProps> = ({
  companyName,
  address,
  postnumber,
  city,
  phone,
  website,
  buttons,
}: CompanyProps) => {

  const externalSite = website.indexOf('http://') === -1 ? `https://${website}` : website
  
  return (
    <Box
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
          <Text variant="h5">{`${companyName} (${city})`}</Text>
          <Text>{`${address}, ${postnumber} ${city}`}</Text>
          <Text color="blue400">{phone}</Text>
          <Text>
            <Link href={externalSite} color="blue400" underline="small">
              {website}
            </Link>
          </Text>
        </Stack>
      </Box>
      {buttons}
    </Box>
  )
}

export default CompanyListItem
