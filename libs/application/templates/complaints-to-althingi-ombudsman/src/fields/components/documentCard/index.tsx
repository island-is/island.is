import { Box, Text } from '@island.is/island-ui/core'
import upperCase from 'lodash/upperCase'
import React from 'react'

type Props = {
  fileType: string
  text: string
}

export const DocumentCard = ({ fileType, text }: Props) => {
  return (
    <Box
      marginTop={3}
      borderRadius="large"
      background="blue100"
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      paddingX={3}
      paddingY={2}
    >
      <Text variant="h5" color="blue400">
        {text}
      </Text>
      {fileType && (
        <Box
          borderRadius="large"
          padding={1}
          borderColor="blue200"
          border="standard"
        >
          <Text variant="eyebrow" color="blue600" lineHeight="xs">
            {upperCase(fileType)}
          </Text>
        </Box>
      )}
    </Box>
  )
}
