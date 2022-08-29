import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  title: string
  required?: boolean
}

const SectionHeading: React.FC<Props> = ({ title, required }) => (
  <Box marginBottom={3}>
    <Text as="h3" variant="h3">
      {title}
      {required && ' '}
      {required && (
        <Text as="span" color={'red600'} fontWeight="semiBold">
          *
        </Text>
      )}
    </Text>
  </Box>
)

export default SectionHeading
