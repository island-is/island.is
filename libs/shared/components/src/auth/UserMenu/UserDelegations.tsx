import { Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useAuth, useUserInfo } from '@island.is/react-spa/bff'
import { userMessages } from '@island.is/shared/translations'
import { UserDropdownItem } from './UserDropdownItem'
import { UserTopicCard } from './UserTopicCard'

interface UserDelegationsProps {
  showActorButton: boolean
  onSwitchUser: (nationalId: string) => void
}

export const UserDelegations = ({
  showActorButton,
  onSwitchUser,
}: UserDelegationsProps) => {
  const user = useUserInfo()
  const { formatMessage } = useLocale()
  const { switchUser } = useAuth()
  const actor = user.profile.actor

  return (
    <Box>
      <Stack space={1}>
        {showActorButton && !!actor && (
          <UserTopicCard
            colorScheme="blue"
            onClick={() => onSwitchUser(actor.nationalId)}
          >
            {actor.name}
          </UserTopicCard>
        )}
        <UserDropdownItem
          text={formatMessage(userMessages.switchUser)}
          icon={{ icon: 'reload', type: 'outline' }}
          onClick={() => switchUser()}
        />
      </Stack>
    </Box>
  )
}
