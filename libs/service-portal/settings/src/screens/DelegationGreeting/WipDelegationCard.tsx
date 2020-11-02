import { Box, Stack, Columns, Column, Tag } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import * as styles from './wipDeligation.treat'

interface Props {
  label: string
}

export const WipDelegationCard: FC<Props> = ({ label }) => {
  return (
    <Box
      background="white"
      border="standard"
      borderRadius="large"
      paddingY={3}
      paddingX={4}
      height="full"
    >
      <Stack space={1}>
        <Columns space="gutter" alignY="center">
          <Column width="2/12">
            <Box className={styles.WipBoxSmall} />
          </Column>
          <Column>
            <Box display="flex" justifyContent="flexEnd">
              <Tag variant="blue">{label}</Tag>
            </Box>
          </Column>
        </Columns>
        <Columns space={1}>
          <Column width="6/12">
            <Box className={styles.WipBoxLarge} />
          </Column>
        </Columns>
      </Stack>
    </Box>
  )
}

export default WipDelegationCard
