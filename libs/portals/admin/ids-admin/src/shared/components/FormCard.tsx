import { FC } from 'react'

import { Box, Text } from '@island.is/island-ui/core'

interface FormCardProps {
  title: string
}

export const FormCard: FC<FormCardProps> = ({ title, children }) => {
  return (
    <Box
      padding={4}
      borderRadius="large"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
      width="full"
      border="standard"
    >
      <Text as="h2" variant="h3">
        {title}
      </Text>
      <Box marginTop={5}>{children}</Box>
    </Box>
  )
}
