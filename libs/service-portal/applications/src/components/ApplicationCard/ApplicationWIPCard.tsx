import { Box, GridColumn, GridRow, Stack, Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import * as styles from './ApplicationCard.treat'

export const ApplicationWIPCard: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <Box position="relative" border="standard" paddingY={3} paddingX={4}>
      <Box position="absolute" className={styles.wipTag}>
        <Tag variant="blue" label>
          {formatMessage({
            id: 'service.portal:coming-soon',
            defaultMessage: 'Væntanlegt',
          })}
        </Tag>
      </Box>
      <GridRow>
        <GridColumn span="5/12">
          <Box
            background="blue100"
            borderRadius="standard"
            paddingTop={4}
            marginBottom={3}
          />
        </GridColumn>
      </GridRow>
      <Stack space={1}>
        <GridRow>
          <GridColumn span="7/12">
            <Box background="blue100" borderRadius="standard" paddingTop={4} />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="8/12">
            <Box background="blue100" borderRadius="standard" paddingTop={4} />
          </GridColumn>
        </GridRow>
      </Stack>
    </Box>
  )
}
