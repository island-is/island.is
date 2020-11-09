import { Box, Stack, Columns, Column, Tag } from '@island.is/island-ui/core'
import React, { FC } from 'react'

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
            <Box background="blue100" borderRadius="standard" paddingTop={2} />
          </Column>
          <Column>
            <Box display="flex" justifyContent="flexEnd">
              <Tag variant="blue" label>
                {label}
              </Tag>
            </Box>
          </Column>
        </Columns>
        <Columns space={1}>
          <Column width="6/12">
            <Box background="blue100" borderRadius="standard" paddingTop={3} />
          </Column>
        </Columns>
      </Stack>
    </Box>
  )
}

export default WipDelegationCard
