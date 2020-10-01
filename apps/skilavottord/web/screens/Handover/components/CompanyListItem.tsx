import React, { FC } from 'react'
import { Stack, Typography, Box, Link } from '@island.is/island-ui/core'
import * as styles from './CompanyListItem.treat'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { Button } from '@island.is/skilavottord-web/components'

export interface CompanyProps {
  name?: string
  address?: string
  phone?: string
  website?: string
}

export const CompanyListItem: FC<CompanyProps> = ({
  name,
  address,
  phone,
  website,
}: CompanyProps) => {
  const {
    t: { handover: t },
  } = useI18n()

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
          <Typography variant="h5">{name}</Typography>
          <Typography variant="p">{address}</Typography>
          <Typography variant="p">{phone}</Typography>
          <Typography variant="p">
            <Link href={website} color="blue400">
              {website}
            </Link>
          </Typography>
        </Stack>
      </Box>
      <Button href={website} size="small" variant="ghost">
        {t.buttons.website}
      </Button>
    </Box>
  )
}

export default CompanyListItem
