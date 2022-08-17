import React from 'react'
import { Stack, Text, SkeletonLoader, Box } from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { userMessages } from '@island.is/shared/translations'
import { UserTopicCard } from './UserTopicCard'
import { UserDropdownItem } from './UserDropdownItem'
import { useAuth } from '@island.is/auth/react'

interface UserDelegationsProps {
  user: User
  onSwitchUser: (nationalId: string) => void
}

export const UserDelegations = ({
  user,
  onSwitchUser,
}: UserDelegationsProps) => {
  const { formatMessage } = useLocale()
  const { switchUser } = useAuth()
  const actor = user.profile.actor

  return (
    <Box>
      <Stack space={1}>
        {!!actor && (
          <UserTopicCard
            colorScheme="blue"
            onClick={() => onSwitchUser(actor?.nationalId)}
          >
            {actor?.name}
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
