import { Box, Divider, Text } from '@island.is/island-ui/core'

interface Props {
  notifications: Array<{ title: string; description: string; date?: string }>
}

export const Notifications = ({ notifications }: Props) => {
  return (
    <>
      {notifications.map((notification) => (
        <>
          <Divider />
          <Box padding={2}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Text color="blue400">{notification.title}</Text>
              <Text variant="small">{notification.date}</Text>
            </Box>
            <Box marginTop={1}>
              <Text variant="small">{notification.description}</Text>
            </Box>
          </Box>
        </>
      ))}
    </>
  )
}
