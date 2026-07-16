import { Box, Text } from '@island.is/island-ui/core'
import {
  AvatarImage,
  FALLBACK_ORG_LOGO_URL,
  getInitials,
  ORG_LOGO_PARAMS,
} from '@island.is/portals/my-pages/core'

type Props =
  | { variant: 'user'; name: string; logoUrl?: never }
  | { variant: 'organization'; logoUrl?: string; name?: never }

const ConversationAvatar = ({ variant, name, logoUrl }: Props) => {
  if (variant === 'organization') {
    return (
      <AvatarImage
        as="div"
        background="blue100"
        img={logoUrl ? logoUrl.concat(ORG_LOGO_PARAMS) : FALLBACK_ORG_LOGO_URL}
      />
    )
  }

  return (
    <Box
      aria-hidden="true"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      background="blueberry100"
      style={{ width: 48, height: 48, flexShrink: 0 }}
    >
      <Text variant="h5" as="p">
        {getInitials(name ?? '')}
      </Text>
    </Box>
  )
}

export default ConversationAvatar
