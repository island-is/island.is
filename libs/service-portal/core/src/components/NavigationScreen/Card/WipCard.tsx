import { Box, Stack, Columns, Column, Tag } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import * as styles from './WipCard.treat'

interface Props {
  label: string
}

export const WipCard: FC<Props> = ({ label }) => {
  return (
    <Box
      background="white"
      border="standard"
      borderRadius="large"
      paddingY={3}
      paddingX={4}
      height="full"
    >
      <Stack space={2}>
        <Columns space="gutter">
          <Column width="3/5">
            <Box className={styles.WipBoxSmall} />
          </Column>
          <Column>
            <Box display="flex" justifyContent="flexEnd">
              <Tag variant="blue">{label}</Tag>
            </Box>
          </Column>
        </Columns>
        <Box className={styles.WipBoxLarge} />
        <Columns space={1}>
          <Column width="4/12">
            <Box className={styles.WipBoxSmall} />
          </Column>
          <Column width="4/12">
            <Box className={styles.WipBoxSmall} />
          </Column>
          <Column width="3/12">
            <Box className={styles.WipBoxSmall} />
          </Column>
        </Columns>
      </Stack>
    </Box>
  )
}

export default WipCard
