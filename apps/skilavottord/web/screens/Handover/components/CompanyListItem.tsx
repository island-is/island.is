import React, { FC, ReactNode } from 'react'
import { Stack, Text, Box, Link } from '@island.is/island-ui/core'
import * as styles from './CompanyListItem.treat'

export interface CompanyProps {
  companyName?: string
  name?: string
  address: string
  city?: string
  postnumber?: string
  postNumber?: string
  phone: string
  website: string
  buttons?: ReactNode
}

export const CompanyListItem: FC<CompanyProps> = ({
  companyName,
  name,
  address,
  postnumber,
  postNumber,
  city,
  phone,
  website,
  buttons,
}: CompanyProps) => {
  const externalSite =
    website.indexOf('http://') === -1 ? `https://${website}` : website

  // temporary until backend is ready
  const addressField =
    postnumber && city
      ? `${address}, ${postnumber} ${city}`
      : `${address}, ${postNumber}`
  const nameField = companyName ?? name
  const cityField = city ? `(${city})` : ''

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
          <Text variant="h5">{`${nameField} ${cityField}`}</Text>
          <Text>{addressField}</Text>
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
