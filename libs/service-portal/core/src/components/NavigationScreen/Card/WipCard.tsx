import { Box, Stack, Columns, Column, Tag } from '@island.is/island-ui/core'
import React, { FC } from 'react'

interface Props {
  label: string
}

export const WipCard: FC<React.PropsWithChildren<Props>> = ({ label }) => {
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
            <Box background="blue100" borderRadius="standard" paddingTop={4} />
          </Column>
          <Column>
            <Box display="flex" justifyContent="flexEnd">
              <Tag variant="blue" outlined>
                {label}
              </Tag>
            </Box>
          </Column>
        </Columns>
        <Box background="blue100" borderRadius="standard" paddingTop={6} />
        <Columns space={1}>
          <Column width="4/12">
            <Box background="blue100" borderRadius="standard" paddingTop={4} />
          </Column>
          <Column width="4/12">
            <Box background="blue100" borderRadius="standard" paddingTop={4} />
          </Column>
          <Column width="3/12">
            <Box background="blue100" borderRadius="standard" paddingTop={4} />
          </Column>
        </Columns>
      </Stack>
    </Box>
  )
}

export default WipCard
