import React, { FC } from 'react'
import { Box, Text, Divider } from '@island.is/island-ui/core'

interface NotificationSettingsCardProps {
  title?: string | null
}

export const NotificationSettingsCard: FC<
  React.PropsWithChildren<NotificationSettingsCardProps>
> = ({ title, children }) => {
  return (
    <Box
      border="standard"
      paddingX={[2, 4]}
      paddingTop={3}
      paddingBottom={[3, 4]}
      borderRadius="default"
    >
      <Text variant="h4" marginBottom={3} as="h3">
        {title}
      </Text>
      <Divider />
      <Box paddingTop={[3, 4]}>{children}</Box>
    </Box>
  )
}
