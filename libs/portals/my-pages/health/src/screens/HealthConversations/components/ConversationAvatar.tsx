import { Box, Icon, Text } from '@island.is/island-ui/core'
import type { IconMapIcon } from '@island.is/island-ui/core'
import { getInitials } from '@island.is/portals/my-pages/core'

type Props =
  | { name: string; icon?: never; variant: 'user' | 'organization' }
  | { icon: IconMapIcon; name?: never; variant?: never }

// TODO: Clean up and remove icon prop when we have institution logos and a decided fallback icon, could use
// shared document component then which needs to be created.
const ConversationAvatar = ({ name, icon, variant }: Props) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    background={
      icon ? 'blue100' : variant === 'user' ? 'blueberry100' : 'blue100'
    }
    borderColor={icon ? 'blue200' : undefined}
    borderWidth={icon ? 'standard' : undefined}
    style={{
      width: 48,
      height: 48,
      flexShrink: 0,
      overflow: icon ? 'hidden' : undefined,
    }}
  >
    {icon ? (
      <Icon icon={icon} type="outline" color="blue400" />
    ) : (
      <Text variant="h5" as="p">
        {getInitials(name ?? '')}
      </Text>
    )}
  </Box>
)

export default ConversationAvatar
