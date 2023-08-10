import React, { FC } from 'react'
import { Box, Text, Icon } from '@island.is/island-ui/core'

export interface Props {
  title: string
  subtitle: string
}

const Approved: FC<React.PropsWithChildren<Props>> = ({ title, subtitle }) => {
  return (
    <Box
      padding={2}
      marginTop={4}
      marginBottom={6}
      background="mint100"
      borderColor="mint200"
      border="standard"
      borderRadius="standard"
    >
      <Box display="flex" alignItems="center">
        <Text variant="h4">{title}</Text>
      </Box>
      <Text paddingTop={1}>{subtitle}</Text>
    </Box>
  )
}

export default Approved
