import cn from 'classnames'
import { Box, Text } from '@island.is/island-ui/core'
import {
  AvatarImage,
  FALLBACK_ORG_LOGO_URL,
  getInitials,
  ORG_LOGO_PARAMS,
} from '@island.is/portals/my-pages/core'
import * as styles from './ConversationAvatar.css'

type Props = (
  | { variant: 'user'; name: string; logoUrl?: never }
  | { variant: 'organization'; logoUrl?: string; name?: never }
) & {
  large?: boolean
  tone?: 'tinted' | 'light'
}

const ConversationAvatar = ({
  variant,
  name,
  logoUrl,
  large,
  tone = 'tinted',
}: Props) => {
  if (variant === 'organization') {
    return (
      <AvatarImage
        as="div"
        background={tone === 'light' ? 'white' : 'blue100'}
        large={large}
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
      background={tone === 'light' ? 'white' : 'blueberry100'}
      className={cn(styles.userAvatar, { [styles.userAvatarLarge]: large })}
    >
      <Text variant="h5" as="p">
        {getInitials(name ?? '')}
      </Text>
    </Box>
  )
}

export default ConversationAvatar
