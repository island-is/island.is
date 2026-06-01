import { Box, Text } from '@island.is/island-ui/core'
import { getInitials } from '@island.is/portals/my-pages/core'

type Props = {
  name: string
  variant: 'user' | 'organization'
}

const ConversationAvatar = ({ name, variant }: Props) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    background={variant === 'user' ? 'blueberry100' : 'blue100'}
    style={{ width: 48, height: 48, flexShrink: 0 }}
  >
    <Text variant="h5" as="p">
      {getInitials(name)}
    </Text>
  </Box>
)

export default ConversationAvatar
