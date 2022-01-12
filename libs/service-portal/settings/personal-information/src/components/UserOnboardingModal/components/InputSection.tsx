import React, { FC, ReactNode } from 'react'
import { Text, Divider, Box } from '@island.is/island-ui/core'

interface Props {
  title: string
  text: string
  children?: ReactNode
}

export const InputSection: FC<Props> = ({ title, text, children }) => {
  return (
    <Box paddingTop={4}>
      <Text variant="h5" as="h2" marginBottom={1}>
        {title}
      </Text>
      <Text variant="medium" marginBottom={4}>
        {text}
      </Text>
      <Box marginBottom={4}>{children}</Box>
      <Divider />
    </Box>
  )
}
