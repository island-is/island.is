import React, { FC, ReactNode } from 'react'
import { Stack, Text, Box } from '@island.is/island-ui/core'
import * as styles from './CompanyListItem.treat'
import { useI18n } from '@island.is/skilavottord-web/i18n'

export interface CompanyProps {
  companyId: string
  companyName: string
  city: string
  active: string
  buttons?: ReactNode
}

export const CompanyListItem: FC<CompanyProps> = ({
  companyId,
  companyName,
  active,
  buttons,
}: CompanyProps) => {
  const {
    t: { recyclingCompanies: t },
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
          <Text variant="h5">{companyName}</Text>
          <Text>{companyId}</Text>
          <Text>{active ? t.status.active : t.status.inactive}</Text>
        </Stack>
      </Box>
      {buttons}
    </Box>
  )
}

export default CompanyListItem
