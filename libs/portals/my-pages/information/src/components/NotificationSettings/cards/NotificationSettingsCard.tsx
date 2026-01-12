import { Box, Divider, Text } from '@island.is/island-ui/core'
import { PropsWithChildren } from 'react'

interface NotificationSettingsCardProps {
  title?: string | null
}

export const NotificationSettingsCard = ({
  title,
  children,
}: PropsWithChildren<NotificationSettingsCardProps>) => {
  return (
    <Box
      border="standard"
      paddingX={[2, 4]}
      paddingTop={3}
      paddingBottom={[3, 4]}
      borderRadius="large"
    >
      {title && (
        <>
          <Text variant="h4" marginBottom={3} as="h3">
            {title}
          </Text>
          <Divider />
        </>
      )}
      <Box paddingTop={[3, 4]}>{children}</Box>
    </Box>
  )
}
